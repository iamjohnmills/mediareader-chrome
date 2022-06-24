const mediareader = new MediaReader();
const store = new Store();
  // const feeds = [
  //       'https://www.slashgear.com/feed/',
  //       'https://www.inputmag.com/rss',
  //       'https://www.popsci.com/feed/',
  //       'https://futurism.com/feed',
  //       'http://feeds2.feedburner.com/Swissmiss',
  //       'https://www.youtube.com/feeds/videos.xml?channel_id=UCI4fHQkguBNW3SwTqmehzjw',
  //       'https://www.youtube.com/feeds/videos.xml?channel_id=UCi8e0iOVk1fEOogdfu4YgfA',
  //       'https://www.youtube.com/feeds/videos.xml?playlist_id=PLYjm6U0oFW7zxisuVKVrsHeNJao2mDEIi',
  //
  //       'https://hnrss.org/newest',
  //       'https://hnrss.org/show',
  //
  //       'https://www.reddit.com/r/interestingasfuck.rss',
  //       'https://www.reddit.com/r/Damnthatsinteresting.rss',
  //       'https://www.reddit.com/r/BeAmazed.rss',
  //       'https://www.reddit.com/r/interestingasfuck+Damnthatsinteresting+BeAmazed.rss',
  //
  //       'https://onmilwaukee.com/rss',
  //       'http://feeds.feedburner.com/thursdaynightpizza/zwyW',
  //       'https://goingawesomeplaces.com/feed/',
  //
  //       'https://foodgawker.com/feed',
  //
  //       'https://feeds.feedburner.com/uncrate',
  //       'http://www.dudeiwantthat.com/rss/',
  //       'https://feeds.feedburner.com/BlessThisStuff?format=xml',
  //       'http://www.thecoolector.com/feed/',
  //       'http://www.werd.com/feed/',
  //       'http://hiconsumption.com/feed/',
  //       'http://coolmaterial.com/feed/',
  //
  //       'https://www.carryology.com/feed/',
  //       'http://everyday-carry.com/rss',
  //
  //       'https://thememedaddy.tumblr.com/rss',
  //       'https://memeclassheroes.tumblr.com/rss',
  //       'https://www.reddit.com/r/dankmemes/top.rss',
  // ]

  const media_filters = [
    'https://styles.redditmedia.com/t5_363r3/styles/communityIcon_8ve5xewye8461.png?width=256&s=a82425e9718e43411556f8fd9732a80b55eb478d',
    'https://cdn.blessthisstuff.com/imagens/banner/banner-etq-interior.jpg',
    'https://cdn.blessthisstuff.com/imagens/banner/banner-nomos-glashutte.jpg',
    'https://cdn.blessthisstuff.com/imagens/banner/banner-floyd-interior.jpg',
    'https://cdn.blessthisstuff.com/imagens/banner/banner-expedition-units-interior.jpg',
    'https://www.youtube.com/embed/QzC0pxSnu3o',
    'https://www.slashgear.com/img/SlashGear-logo-white.svg',
    'https://www.redditstatic.com/desktop2x/img/powerups/powerups-rangers.png',
    'https://b.thumbs.redditmedia.com/b19-jQLBsVc2-EQfPx5WEQkYIL_clR0mhba4-pHT0AA.png',
    'https://a.thumbs.redditmedia.com/kIpBoUR8zJLMQlF8azhN-kSBsjVUidHjvZNLuHDONm8.png',
    'https://www.redditstatic.com/desktop2x/img/powerups/moderator-achievement.svg',
    'https://www.redditstatic.com/desktop2x/img/loading.gif',
    'https://www.redditstatic.com/desktop2x/img/powerups/powerups-rangers.png',
    'https://styles.redditmedia.com/t5_6gfz1o/styles/profileIcon_snoo4b14e691-8ab0-4856-b738-370468248769-headshot.png?width=256&height=256&frame=1&crop=256:256,smart&s=9eeacd2243f165b8adce9aec7aa14f6bbcd34c5c',
    'https://styles.redditmedia.com/t5_pmgit/styles/profileIcon_snooc5f89ebf-0be7-4abf-aa0e-7d84e2c2c9cc-headshot.png?width=256&height=256&frame=1&crop=256:256,smart&s=ed36c33e05e7a26d9e2a0e7eecbf04927e4178da',
    'https://styles.redditmedia.com/t5_5y0pal/styles/profileIcon_snoo2b0d34e4-3fe1-4200-8c74-3aeed19d3173-headshot.png?width=256&height=256&frame=1&crop=256:256,smart&s=110992edf3d4e4c6d9c366cae1081730e1141d0b',
    'https://styles.redditmedia.com/t5_4xm8rb/styles/profileIcon_snoo9bff3bf2-f193-4ad6-8259-bae9d43675ce-headshot.png?width=256&height=256&frame=1&crop=256:256,smart&s=37f009d6055a9d9453b67222ee276bfb56ca938d',
    'https://styles.redditmedia.com/t5_1zh6re/styles/profileIcon_snooe7fb9e3c-db2b-4eed-a296-ab2322a76d5c-headshot.png?width=256&height=256&frame=1&crop=256:256,smart&s=8ec01fc243a55743aff2e063b814ff7d2e389d36',
    'https://styles.redditmedia.com/t5_36nhdw/styles/profileIcon_u4d88dqnmc191.jpeg?width=256&height=256&frame=1&crop=256:256,smart&s=6b10dd9c59b6543a2ebfdc7bfe6b847db24834ed',
    'https://styles.redditmedia.com/t5_202xpu/styles/profileIcon_snoo2b72f28f-6366-4fdf-ac04-2f26879e7d67-headshot.png?width=256&height=256&frame=1&crop=256:256,smart&s=5ecb8af4776faabc5871d16c721abb20f01b6d6b',
  ]
  const content_filters = [
    'biden',
    'hackers',
    'slain',
    'gunpoint',
    'swastikas',
    'bullets',
    'standoff',
    'beatings',
    'assassination',
    'accused',
    'trump',
    'biden',
    'violence',
    'allegations',
    'sentenced',
    'republicans',
    'prison',
    'arrested',
    'charged',
    'covid',
    'pandemic',
    'crash',
    'crime',
    'crisis',
    'killing',
    'kill',
    'senator',
    'taliban',
    'vote',
    'fbi',
    'gop',
    'supreme court',
    'police',
    'death',
    'democrat',
    'cnn',
    'gorilla'
  ]

let current_feed, els;

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


//
//
// Fetch Feed
const handleFetchFeedSuccess = async (feed_raw,url) => {
  await store.createFeed(url);
  current_feed = url;
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
        await createMediaFilterActions(el_media)
        await createIframeResizePaddle(el_media);
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
const handleFetchSourceSuccess = (source_raw, root, button, feed_media_objs, url, first_media_obj) => {
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
      await createMediaFilterActions(el_media)
      await createIframeResizePaddle(el_media);
      await root.appendChild(el_media);
    }
  }
}
const handleFetchSourceError = (error,button) => {
  button.innerHTML = `Error fetching source url. ${error}`;
}
const handleParseSourceError = (error,button) => {
  button.innerHTML = `Error parsing source for media. ${error}`;
}


//
//
// Elements
const createIframeResizePaddle = (root) => {
  const iframe = root.querySelector('iframe');
  if(!iframe) return;
  const item_els = {
    container: document.createElement('div')
  }
  item_els.container.setAttribute('class','resize flex-center');
  item_els.container.setAttribute('draggable','false');
  item_els.container.innerHTML = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zM7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10z"/></svg>`;
  item_els.container.addEventListener('click', (event) => { iframe.style.height = `${parseInt(iframe.style.height) + 215}px` } );
  root.appendChild(item_els.container);
}
const createMediaFilterActions = (root) => {
  const item_els = {
    container: document.createElement('div'),
    createfilter: document.createElement('button'),
  }
  item_els.createfilter.innerHTML = `<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/></svg>`;
  item_els.container.setAttribute('class','media-actions flex-center');
  item_els.createfilter.setAttribute('class','flex-center');
  item_els.createfilter.addEventListener('click', (event) => {  } );
  item_els.container.appendChild(item_els.createfilter);
  root.querySelector('figcaption').appendChild(item_els.container);
}
const createMediaElements = (media_objs, url) => {
  return media_objs.map( (media_obj) => {
    const item_els = {
      wrapper: document.createElement('div'),
      container: document.createElement('div'),
      figure: document.createElement('figure'),
      caption: document.createElement('figcaption'),
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
      item_els.figure.innerHTML = `<iframe style="height:${media_obj.height}px" src="${media_obj.url}" />`;
    }
    item_els.caption.innerHTML = `<span>${media_obj.url}</span>`;
    item_els.figure.appendChild(item_els.caption)
    item_els.container.appendChild(item_els.figure)
    item_els.wrapper.appendChild(item_els.container)
    return item_els.wrapper
  });
}
const createMediaFiltersMenu = () => {
  els.menu_mediafilters.innerHTML = ``;
  media_filters.forEach(filter => {
    const item_els = {
      container: document.createElement('menuitem'),
      filter: document.createElement('span'),
      remove: document.createElement('button'),
    }
    item_els.filter.innerHTML = filter;
    item_els.remove.innerHTML = 'x';
    item_els.remove.addEventListener('click',() => { handleClickRemoveMediaFilter(filter) })
    item_els.container.appendChild(item_els.filter);
    item_els.container.appendChild(item_els.remove);
    els.menu_mediafilters.appendChild(item_els.container);
  })
}
const createContentFiltersMenu = () => {
  els.menu_contentfilters.innerHTML = ``;
  content_filters.forEach(filter => {
    const item_els = {
      container: document.createElement('menuitem'),
      filter: document.createElement('span'),
      remove: document.createElement('button'),
    }
    item_els.filter.innerHTML = filter;
    item_els.remove.innerHTML = 'x';
    item_els.remove.addEventListener('click',() => { handleClickRemoveContentFilter(filter) })
    item_els.container.appendChild(item_els.filter);
    item_els.container.appendChild(item_els.remove);
    els.menu_contentfilters.appendChild(item_els.container);
  })
}
const createFeedsMenu = () => {
  els.menu_feeds.innerHTML = ``;
  store.getFeeds().forEach(feed => {
    const item_els = {
      container: document.createElement('menuitem'),
      url: document.createElement('a'),
      remove: document.createElement('button'),
    }
    item_els.url.setAttribute('href','#');
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


//
//
// Interactions
const handleLoadFeed = async function(url){
  els.content.innerHTML = ``;
  els.loading.classList.add('on');
  mediareader.getURL(url).then( (response) => { handleFetchFeedSuccess(response,url) }).catch( (error) => { handleFetchFeedError(error,url) });
}
const handleClickLoadMore = (root, button, url, feed_media_objs, first_media_obj) => {
  if(button.dataset.state !== 'not-loaded') return;
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
  active_menu.classList.toggle('active');
  active_action.classList.toggle('active');
  document.querySelectorAll('menu.active,nav button.active').forEach(node => {
    if(node !== active_menu && node !== active_action) node.classList.remove('active');
  });
}
const hideActiveMenus = () => {
  const menu_active = document.querySelector('menu.active');
  const action_active = document.querySelector('button.action.active');
  if(action_active && menu_active) {
    menu_active.classList.remove('active');
    action_active.classList.remove('active');
  }
}
const handleInputFeed = async (url) => {
  handleLoadFeed(url);
}
const handleClickShowFeeds = async () => {
  await createFeedsMenu();
  setActiveMenu(els.menu_feeds,els.action_showfeeds)
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
    action_showmediafilters: document.getElementById('action-showmediafilters'),
    action_showcontentfilters: document.getElementById('action-showcontentfilters'),
    input_feedurl: document.getElementById('input-feedurl'),
    loading: document.getElementById('loading'),
    menu_contentfilters: document.getElementById('menu-contentfilters'),
    menu_mediafilters: document.getElementById('menu-mediafilters'),
    menu_feeds: document.getElementById('menu-feeds'),
    content: document.getElementById('content'),
  }
  createContentFiltersMenu();
  createMediaFiltersMenu();
  document.addEventListener('click', (event) => { if(!event.target.closest('.active')) hideActiveMenus(event) });
  els.logo.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }) });
  els.action_showfeeds.addEventListener('click', () => { handleClickShowFeeds() });
  els.action_showcontentfilters.addEventListener('click', () => { setActiveMenu(els.menu_contentfilters,els.action_showcontentfilters) });
  els.action_showmediafilters.addEventListener('click', () => { setActiveMenu(els.menu_mediafilters,els.action_showmediafilters) });
  els.input_feedurl.addEventListener('keydown', (event) => { if(event.key === 'Enter' || event.keyCode === 13) handleInputFeed(event.target.value) });
}

document.addEventListener('DOMContentLoaded', start);
