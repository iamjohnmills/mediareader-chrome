const mediareader = new MediaReader();
const store = new Store();

let current_feed, els, halt;

const _timeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  if(isNaN(seconds)) return false;
  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)} year${Math.floor(interval) !== 1 ? 's' : ''} ago`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)} month${Math.floor(interval) !== 1 ? 's' : ''} ago`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)} day${Math.floor(interval) !== 1 ? 's' : ''} ago`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)} hour${Math.floor(interval) !== 1 ? 's' : ''} ago`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} minute${Math.floor(interval) !== 1 ? 's' : ''} ago`;
  return `Just now`
}

const _htmlToElement = (html) => {
  const template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}


//
//
// Fetch Feed
const handleFetchFeedSuccess = async (feed_raw,url) => {
  await store.createFeed(url);
  await createFeedsMenu();
  const content_filters = await store.getContentFilters(current_feed).map(filter => filter.rule);
  const media_filters = await store.getMediaFilters(current_feed).map(filter => filter.rule);
  mediareader.parseFeed(feed_raw,content_filters,media_filters).then((response) => { handleParseFeedSuccess(response,url) }).catch((error) => { handleParseFeedError(error) } );
}
const handleParseFeedSuccess = async (feed_item_objs,feed_url) => {
  els.content.innerHTML = ``;
  for(const [i,item] of feed_item_objs.entries()){
    const item_els = {
      container: document.createElement('article'),
      title: document.createElement('h2'),
      date: document.createElement('time'),
      media: document.createElement('div'),
      loadmore: document.createElement('button'),
    }
    const time_ago = _timeAgo(new Date(item.date));
    item_els.date.innerHTML = time_ago;
    item_els.media.setAttribute('class', 'medias');
    item_els.loadmore.setAttribute('class', 'load-more');
    item_els.loadmore.setAttribute('data-state', 'not-loaded');
    item_els.title.innerHTML = `<a href="${item.url}" target="_blank">${item.title}</a>`;
    item_els.loadmore.innerHTML = `Load more media from source`;
    let first_media_obj = await getFirstMediaObject(item.media_objs);
    if(first_media_obj){
      const els_media = await createMediaElements([first_media_obj], item.url)
      for(el_media of els_media) {
        await item_els.media.appendChild(el_media)
      }
    }
    item_els.loadmore.addEventListener('click', () => { handleClickLoadMore(item_els.media, item_els.loadmore, item.url, item.media_objs, first_media_obj) })
    if(time_ago) item_els.container.appendChild(item_els.date);
    item_els.container.appendChild(item_els.title);
    item_els.container.appendChild(item_els.media);
    item_els.container.appendChild(item_els.loadmore);
    if(els.input_feedurl.value === feed_url) await els.content.appendChild(item_els.container);
    if(i === feed_item_objs.length - 1) els.loading.classList.remove('on');
  }
}
const handleFetchFeedError = (error,url) => {
  const el_tryagain = document.createElement('a');
  el_tryagain.addEventListener('click',(event) => { event.preventDefault(); handleLoadFeed(url); });
  el_tryagain.innerHTML = ` <a href="#">Try again</a>`
  els.content.innerHTML = `Error loading feed: <i>${error.statusText}</i>`;
  els.content.appendChild(el_tryagain);
  els.loading.classList.remove('on')
}
const handleParseFeedError = (error) => {
  els.content.innerHTML = `Error parsing feed: <i>${error}</i>`;
  els.loading.classList.remove('on')
}
const getFirstMediaObject = async (media_objs) => {
  if(!media_objs.length) return false;
  let first_media_obj;
  for(let i in media_objs){
    first_media_obj = await mediareader.downloadMedia(media_objs[i]);
    if(first_media_obj) return first_media_obj;
    if(i === media_objs.length - 1) return false;
  }
}




//
//
// Fetch Source
const handleFetchSourceSuccess = async (source_raw, root, button, feed_media_objs, url, first_media_obj) => {
  const media_filters = await store.getMediaFilters(current_feed).map(filter => filter.rule);
  mediareader.getMediaInString(source_raw,media_filters).then((response) => { handleParseSourceSuccess(response, root, button, feed_media_objs, url, first_media_obj) }).catch((error) => { handleParseSourceError(error,button) } );
}
const handleParseSourceSuccess = async (media_objs, root, button, feed_media_objs=[], url, first_media_obj) => {
  let merged = [...new Map(feed_media_objs.concat(media_objs).map(item => [item.url, item])).values()];
  let filtered = await merged.filter(media_obj => {
    const not_visible = !feed_media_objs.length || (feed_media_objs.length && media_obj.url !== feed_media_objs[0].url);
    const not_first = !first_media_obj || (first_media_obj && media_obj.url !== first_media_obj.url);
    const unique_url = merged.indexOf(merged_obj => media_obj.url !== merged_obj.url) === -1;
    return not_visible && not_first && unique_url;
  });
  let unique = first_media_obj ? [first_media_obj] : [];
  for(let i in filtered){
    if(halt){
      halt = false;
      break;
    }
    button.innerHTML = `Analyzing media object ${parseInt(i) + 1} of ${filtered.length}`;
    const media_downloaded = await mediareader.downloadMedia(filtered[i]);
    const is_unique = await mediareader.isImageUnique(media_downloaded,unique);
    if(is_unique) unique.push(media_downloaded);
  }
  if(first_media_obj) unique.shift();
  if(!unique.length) {
    button.innerHTML = `No source media found.`;
    button.setAttribute('data-state','loaded');
  } else {
    button.innerHTML = `Found ${unique.length} media source${unique.length !== 1 ? 's' : ''}.`;
    const els_media = await createMediaElements(unique, url);
    for(el_media of els_media) {
      await root.appendChild(el_media);
    }
  }
}
const handleFetchSourceError = (error,button) => {
  button.setAttribute('data-state','not-loaded');
  button.innerHTML = `Error fetching source url. <i>${error.statusText}</i> Try again`;
}
const handleParseSourceError = (error,button) => {
  button.innerHTML = `Error parsing source for media. <i>${error}</i>`;
}




//
//
// Elements
const createMediaElements = (media_objs, url) => {
  return media_objs.map( (media_obj) => {
    const item_els = {
      wrapper: document.createElement('div'),
      container: document.createElement('div'),
      figure: document.createElement('figure'),
      caption: document.createElement('figcaption'),
      filters: document.createElement('div'),
      createfilter: document.createElement('button'),
      resize: document.createElement('div')
    }
    item_els.wrapper.setAttribute('class',`media-wrapper ${media_obj.type} ${(media_obj.brand ? media_obj.brand : 'default')}`);
    item_els.container.setAttribute('class',`media ${media_obj.type} ${(media_obj.brand ? media_obj.brand : 'default')}`);
    item_els.caption.setAttribute('class','caption');
    if(media_obj.type == 'video'){
      item_els.figure.innerHTML = `<video preload="auto" loop muted controls><source type="${media_obj.mime}" src="${media_obj.url.replace('.gifv','.mp4')}" /></video>`
    } else if(media_obj.ext == 'svg'){
      item_els.figure.innerHTML = `<a href="${url}" target="_blank"><img src="${media_obj.url}" /></a>`;
    } else if(media_obj.type == 'image'){
      item_els.figure.innerHTML = `<a href="${url}" target="_blank"><img src="${media_obj.dataurl}" /></a>`;
    } else if(media_obj.type == 'embed'){
      const iframe = document.createElement('iframe');
      iframe.style.height = `${media_obj.height}px`;
      iframe.setAttribute('src', media_obj.url);
      item_els.resize.setAttribute('class','resize flex-center');
      item_els.resize.setAttribute('draggable','false');
      item_els.resize.innerHTML = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zM7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10z"/></svg>`;
      item_els.resize.addEventListener('click', (event) => { iframe.style.height = `${parseInt(iframe.style.height) + 215}px` } );
      item_els.figure.appendChild(iframe);
      item_els.wrapper.appendChild(item_els.resize);
    }
    item_els.caption.innerHTML = `<span>${media_obj.url}</span>`;
    item_els.createfilter.innerHTML = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/></svg>`;
    item_els.filters.setAttribute('class','media-actions flex-center');
    item_els.createfilter.setAttribute('class','flex-center');
    item_els.createfilter.addEventListener('click', (event) => { handleClickCreateMediaFilter(item_els.wrapper,media_obj.url) } );
    item_els.filters.appendChild(item_els.createfilter);
    item_els.caption.appendChild(item_els.filters);
    item_els.figure.appendChild(item_els.caption);
    item_els.container.appendChild(item_els.figure);
    item_els.wrapper.appendChild(item_els.container);
    return item_els.wrapper
  });
}
const createFeedsMenu = () => {
  if(!store.getFeeds().length){
    els.menu_feeds.innerHTML = `Feeds that you enter will appear here.`;
    return;
  }
  els.menu_feeds.innerHTML = ``;
  store.getFeeds().forEach(feed => {
    const item_els = {
      container: document.createElement('menuitem'),
      url: document.createElement('a'),
      remove: document.createElement('button'),
    }
    item_els.url.setAttribute('href','#');
    item_els.container.setAttribute('class','stretch');
    if(feed.url === current_feed) item_els.url.setAttribute('class','active');
    item_els.url.innerHTML = feed.url;
    item_els.url.addEventListener('click',(event) => { handleClickFeed(event,feed.url) })
    item_els.remove.innerHTML = 'x';
    item_els.remove.addEventListener('click',() => { handleClickRemoveFeed(feed.url) })
    item_els.container.appendChild(item_els.url);
    item_els.container.appendChild(item_els.remove);
    els.menu_feeds.appendChild(item_els.container);
  })
}
const createConfirmActionItem = async (options) => {
  const item_els = {
    container: document.createElement(options.container_tag),
    action: _htmlToElement(`<a href="#">${options.action_text}</a>`),
    confirm: _htmlToElement(`<span style="display:none">${options.confirm_text}</span>`),
    yes: _htmlToElement(`<a style="display:none" href="#">Yes</a>`),
    cancel: _htmlToElement(`<a style="display:none" href="#">Cancel</a>`),
  }
  item_els.container.appendChild(item_els.action);
  item_els.container.appendChild(item_els.confirm);
  item_els.container.appendChild(item_els.yes);
  item_els.container.appendChild(item_els.cancel);
  item_els.action.addEventListener('click',(event) => {
    item_els.action.style.display = 'none';
    item_els.confirm.style = '';
    item_els.yes.style = '';
    item_els.cancel.style = '';
  });
  item_els.cancel.addEventListener('click',(event) => {
    item_els.action.style = '';
    item_els.confirm.style.display = 'none';
    item_els.yes.style.display = 'none';
    item_els.cancel.style.display = 'none';
  });
  item_els.yes.addEventListener('click', async (event) => {
    await options.on_success();
    item_els.confirm.innerHTML = options.on_success_text;
    item_els.yes.style.display = 'none';
    item_els.cancel.style.display = 'none';
  });
  return item_els.container;
}
const createSettingsMenu = async () => {
  els.menu_settings.innerHTML = ``;
  const has_feeds = await store.getFeeds().length;
  const has_mediafilters = await store.getMediaFilters().length;
  const has_contentfilters = await store.getContentFilters().length;
  const item_els = {
    container: document.createElement('div'),
    import_opml: {
      container: document.createElement('menuitem'),
      url: document.createElement('a'),
      message: document.createElement('span'),
      file: _htmlToElement(`<input style="display:none" type="file" />`)
    },
    export_opml: {
      container: document.createElement('menuitem'),
      url: document.createElement('a'),
    },
    clear_feeds: await createConfirmActionItem({
      container_tag: 'menuitem',
      action_text: 'Clear Feeds',
      confirm_text: 'Are you sure you want to clear all feeds?',
      on_success_text: 'Feeds cleared.',
      on_success: async () => {
        item_els.export_opml.container.style.display = 'none';
        await store.clearFeeds();
        createFeedsMenu();
      },
    }),
    clear_mediafilters: await createConfirmActionItem({
      container_tag: 'menuitem',
      action_text: 'Clear Media Filters',
      confirm_text: 'Are you sure you want to clear all media filters?',
      on_success_text: 'Media filters cleared.',
      on_success: async () => {
        await store.clearMediaFilters();
        createMediaFiltersMenu();
      },
    }),
    clear_contentfilters: await createConfirmActionItem({
      container_tag: 'menuitem',
      action_text: 'Clear Content Filters',
      confirm_text: 'Are you sure you want to clear all content filters?',
      on_success_text: 'Content filters cleared.',
      on_success: async () => {
        await store.clearContentFilters();
        createContentFiltersMenu();
      },
    }),
  }

  item_els.import_opml.url.innerHTML = 'Import OPML';
  item_els.import_opml.url.href = '#';
  item_els.import_opml.file.addEventListener('change', (event) => {
    item_els.import_opml.message.innerHTML = ``;
    if(event.target.size > 20000){
      item_els.import_opml.message.innerHTML = `File must be less than 20kb.`;
      return;
    };
    const reader = new FileReader();
    reader.onload = async (file) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(file.target.result, 'text/xml');
      if( xml.documentElement.nodeName == 'parsererror' || !xml.querySelector('outline') ){
        item_els.import_opml.message.innerHTML = `File must be a valid OPML file.`;
      } else {
        await store.importOPML(xml);
        item_els.import_opml.message.innerHTML = `OPML file imported.`;
      }
    };
    reader.readAsText(event.target.files[0]);
  })
  item_els.import_opml.url.addEventListener('click',(event) => {
    event.preventDefault();
    item_els.import_opml.file.click();
  })
  item_els.import_opml.container.appendChild(item_els.import_opml.url);
  item_els.import_opml.container.appendChild(item_els.import_opml.message);
  item_els.import_opml.container.appendChild(item_els.import_opml.file);
  item_els.container.appendChild(item_els.import_opml.container);
  if(has_feeds){
    const feeds_opml = await store.exportFeedsOPML();
    item_els.export_opml.url.href = window.URL.createObjectURL(new Blob([feeds_opml], {type: 'text/plain'}));
    item_els.export_opml.url.download = 'mediareader-feeds.opml';
    item_els.export_opml.url.innerHTML = 'Export OPML';
    item_els.export_opml.container.appendChild(item_els.export_opml.url);
    item_els.container.appendChild(item_els.export_opml.container);
  }
  if(has_feeds) item_els.container.appendChild(item_els.clear_feeds);
  if(has_mediafilters) item_els.container.appendChild(item_els.clear_mediafilters);
  if(has_contentfilters) item_els.container.appendChild(item_els.clear_contentfilters);
  els.menu_settings.appendChild(item_els.container);
}
const createMediaFiltersMenu = () => {
  if(!current_feed){
    els.menu_mediafilters.innerHTML = `Media from feeds that you remove will appear here.`;
    return;
  }
  if(!store.getMediaFilters(current_feed).length){
    els.menu_mediafilters.innerHTML = `No media filters added for <i>${current_feed}</i>`;
    return;
  }
  els.menu_mediafilters.innerHTML = ``;
  store.getMediaFilters(current_feed).forEach(filter => {
    const item_els = {
      container: document.createElement('menuitem'),
      filter: document.createElement('span'),
      remove: document.createElement('button'),
    }
    item_els.container.classList.add('stretch');
    item_els.filter.innerHTML = filter.rule;
    item_els.remove.innerHTML = 'x';
    item_els.remove.addEventListener('click',() => { handleClickRemoveMediaFilter(filter.rule) })
    item_els.container.appendChild(item_els.filter);
    item_els.container.appendChild(item_els.remove);
    els.menu_mediafilters.appendChild(item_els.container);
  })
}
const createContentFiltersMenu = () => {
  els.input_feedurl.value = '';
  if(!store.getContentFilters().length){
    els.menu_contentfilters.innerHTML = `Items with titles that you block will appear here.`;
    return;
  }
  els.menu_contentfilters.innerHTML = ``;
  store.getContentFilters().forEach(filter => {
    const item_els = {
      container: document.createElement('menuitem'),
      filter: document.createElement('span'),
      remove: document.createElement('button'),
    }
    item_els.container.classList.add('stretch');
    item_els.filter.innerHTML = filter.rule;
    item_els.remove.innerHTML = 'x';
    item_els.remove.addEventListener('click',() => { handleClickRemoveContentFilter(filter.rule) })
    item_els.container.appendChild(item_els.filter);
    item_els.container.appendChild(item_els.remove);
    els.menu_contentfilters.appendChild(item_els.container);
  })
}





//
//
// Interactions
const handleLoadFeed = async function(url){
  els.content.innerHTML = ``;
  els.loading.classList.add('on');
  current_feed = url;
  await createMediaFiltersMenu();
  mediareader.getURL(url).then( (response) => { handleFetchFeedSuccess(response,url) }).catch( (error) => { handleFetchFeedError(error,url) });
}
const handleClickLoadMore = (root, button, url, feed_media_objs, first_media_obj) => {
  if(button.dataset.state !== 'not-loaded'){
    halt = true;
    button.setAttribute('data-state','no-loaded');
    return;
  };
  button.setAttribute('data-state','loading');
  button.innerHTML = 'Finding and analyzing media urls...';
  mediareader.getURL(url).then( (response) => { handleFetchSourceSuccess(response, root, button, feed_media_objs, url, first_media_obj) }).catch( (error) => { handleFetchSourceError(error,button) });
}
const handleClickFeed = async (event, feed) => {
  event.preventDefault();
  const el_active_feed = document.querySelector('#menu-feeds a.active');
  if(el_active_feed) el_active_feed.classList.remove('active');
  event.target.classList.add('active');
  hideActiveMenus();
  els.input_feedurl.value = feed;
  handleLoadFeed(feed);
}
const handleClickRemoveFeed = async (feed) => {
  await store.removeFeed(feed);
  await createFeedsMenu();
}
const setActiveMenu = (active_menu, active_action) => {
  els.input_feedurl.value = '';
  if(active_menu.getAttribute('id') === 'menu-contentfilters' && !active_menu.classList.contains('active')){
    els.input_feedurl.setAttribute('data-action', 'contentfilter');
    els.input_feedurl.setAttribute('placeholder', 'Add content filter (ex. gorilla)');
  } else {
    els.input_feedurl.setAttribute('data-action', 'feed');
    els.input_feedurl.setAttribute('placeholder', 'Add Feed URL');
  }
  active_menu.classList.toggle('active');
  active_action.classList.toggle('active');
  document.querySelectorAll('menu.active,nav button.active').forEach(node => {
    if(node !== active_menu && node !== active_action) node.classList.remove('active');
  });
}
const hideActiveMenus = () => {
  if(current_feed && !els.input_feedurl.value) els.input_feedurl.value = current_feed;
  els.input_feedurl.setAttribute('data-action', 'feed');
  els.input_feedurl.setAttribute('placeholder', 'Add Feed URL');
  const menu_active = document.querySelector('menu.active');
  const action_active = document.querySelector('button.action.active');
  if(action_active && menu_active) {
    menu_active.classList.remove('active');
    action_active.classList.remove('active');
  }
}
const handleActionInput = async (value) => {
  if(els.input_feedurl.dataset.action === 'feed'){
    handleLoadFeed(value);
  } else if(els.input_feedurl.dataset.action === 'contentfilter') {
    await store.createContentFilter(value);
    createContentFiltersMenu();
  }
}
const handleClickShowFeeds = async () => {
  await createFeedsMenu();
  setActiveMenu(els.menu_feeds,els.action_showfeeds)
}
const handleClickShowSettings = async () => {
  await createSettingsMenu();
  setActiveMenu(els.menu_settings,els.action_showsettings)
}
const handleClickShowContentFilters = async () => {
  await createContentFiltersMenu();
  setActiveMenu(els.menu_contentfilters,els.action_showcontentfilters)
}
const handleClickShowMediaFilters = async () => {
  await createMediaFiltersMenu();
  setActiveMenu(els.menu_mediafilters,els.action_showmediafilters)
}
const handleClickCreateMediaFilter = async (root,rule) => {
  root.classList.add('removed');
  await store.createMediaFilter(rule,current_feed);
  createMediaFiltersMenu();
}
const handleClickRemoveMediaFilter = async (rule) => {
  await store.removeMediaFilter(rule,current_feed);
  createMediaFiltersMenu();
}
const handleClickRemoveContentFilter = async (rule) => {
  await store.removeContentFilter(rule);
  createContentFiltersMenu();
}




//
//
// Start
const start = async (event) => {
  await store.initialize();
  els = {
    logo: document.getElementById('logo'),
    nav: document.getElementById('nav'),
    action_showfeeds: document.getElementById('action-showfeeds'),
    action_showsettings: document.getElementById('action-showsettings'),
    action_showmediafilters: document.getElementById('action-showmediafilters'),
    action_showcontentfilters: document.getElementById('action-showcontentfilters'),
    input_feedurl: document.getElementById('input-feedurl'),
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    menu_feeds: document.getElementById('menu-feeds'),
    menu_settings: document.getElementById('menu-settings'),
    menu_contentfilters: document.getElementById('menu-contentfilters'),
    menu_mediafilters: document.getElementById('menu-mediafilters'),
    content: document.getElementById('content'),
  }
  document.addEventListener('click', (event) => { if(!event.target.closest('.active') && !event.target.closest('#input-feedurl')) hideActiveMenus(event) });
  els.logo.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }) });
  els.action_showfeeds.addEventListener('click', () => { handleClickShowFeeds() });
  els.action_showsettings.addEventListener('click', () => { handleClickShowSettings() });
  els.action_showmediafilters.addEventListener('click', () => { handleClickShowMediaFilters() });
  els.action_showcontentfilters.addEventListener('click', () => { handleClickShowContentFilters() });
  els.input_feedurl.addEventListener('keydown', (event) => { if(event.key === 'Enter' || event.keyCode === 13) handleActionInput(event.target.value) });
}

document.addEventListener('DOMContentLoaded', start);
