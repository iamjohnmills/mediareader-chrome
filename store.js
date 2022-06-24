
class Store {
  constructor(options) {
    this.feeds = []; // url
    this.filters_media = []; // { filter: '', feed: '' }
    this.filters_content = []; // { filter: '', feed: '' }
  }
  async initialize(){
    await this.initializeFeeds();
    await this.initializeMediaFilters();
    await this.initializeContentFilters();
    return;
  }
  initializeFeeds(){
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get('feeds', (result) => {
        if(Object.keys(result).length !== 0) this.feeds = result.feeds;
        console.log(result);
        return resolve(true);
      });
    });
  }
  initializeMediaFilters(){
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get('filters_media', (result) => {
        if(Object.keys(result).length !== 0) this.filters_media = result.filters_media;
        return resolve(true);
      });
    });
  }
  initializeContentFilters(){
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get('filters_content', (result) => {
        if(Object.keys(result).length !== 0) this.filters_content = result.filters_content;
        return resolve(true);
      });
    });
  }
  saveFeeds(){
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({feeds: this.feeds}, () => {
        return resolve(true);
      });
    });
  }
  saveMediaFilters(){
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({filters_media: this.filters_media}, () => {
        return resolve(true);
      });
    });
  }
  saveContentFilters(){
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({filters_content: this.filters_content}, () => {
        return resolve(true);
      });
    });
  }
  getFeeds(){
    return this.feeds.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
  async createFeed(url){
    const exists = this.feeds.findIndex(feed => feed.url === url) !== -1;
    if(exists) return false;
    const created_at = new Date();
    const feed = { url: url, created_at: created_at.toISOString() };
    await this.feeds.push(feed);
    return await this.saveFeeds();
  }
  async removeFeed(url){
    const index = this.feeds.findIndex(feed => feed.url === url);
    // if(index === -1) return false;
    await this.feeds.splice(index,1);
    return await this.saveFeeds();
  }
  getMediaFilters(feed){
    return this.filters_media;
  }
  getContentFilters(feed){
    return this.filters_content;
  }
}

// const app = {
//   feeds: [
//     'https://www.slashgear.com/feed/',
//     'https://www.inputmag.com/rss',
//     'https://www.popsci.com/feed/',
//     'https://futurism.com/feed',
//     'http://feeds2.feedburner.com/Swissmiss',
//     'https://www.youtube.com/feeds/videos.xml?channel_id=UCi8e0iOVk1fEOogdfu4YgfA',
//     'https://hnrss.org/show',
//
//     'https://www.reddit.com/r/interestingasfuck/top.rss',
//     'https://www.reddit.com/r/Damnthatsinteresting/top.rss',
//     'https://www.reddit.com/r/BeAmazed/top.rss',
//
//     'http://feeds.feedburner.com/thursdaynightpizza/zwyW',
//     'https://goingawesomeplaces.com/feed/',
//
//     'https://foodgawker.com/feed',
//     'https://dwellinggawker.com/feed',
//     'https://craftgawker.com/feed',
//     'https://hnrss.org/newest',
//
//     'https://feeds.feedburner.com/uncrate',
//     'http://www.dudeiwantthat.com/rss/',
//     'https://feeds.feedburner.com/BlessThisStuff?format=xml',
//     'http://www.thecoolector.com/feed/',
//     'http://www.werd.com/feed/',
//     'http://hiconsumption.com/feed/',
//     'http://coolmaterial.com/feed/',
//
//     'https://www.carryology.com/feed/',
//     'http://everyday-carry.com/rss',
//
//     'https://thememedaddy.tumblr.com/rss',
//     'https://memeclassheroes.tumblr.com/rss',
//     'https://www.reddit.com/r/dankmemes/top.rss',
//
//   ],
//   media_filters: [
//     'https://styles.redditmedia.com/t5_363r3/styles/communityIcon_8ve5xewye8461.png?width=256&s=a82425e9718e43411556f8fd9732a80b55eb478d',
//     'https://cdn.blessthisstuff.com/imagens/banner/banner-etq-interior.jpg',
//     'https://cdn.blessthisstuff.com/imagens/banner/banner-nomos-glashutte.jpg',
//     'https://cdn.blessthisstuff.com/imagens/banner/banner-floyd-interior.jpg',
//     'https://cdn.blessthisstuff.com/imagens/banner/banner-expedition-units-interior.jpg',
//     'https://www.youtube.com/embed/QzC0pxSnu3o',
//     'https://www.slashgear.com/img/SlashGear-logo-white.svg',
//     'https://www.redditstatic.com/desktop2x/img/powerups/powerups-rangers.png',
//     'https://b.thumbs.redditmedia.com/b19-jQLBsVc2-EQfPx5WEQkYIL_clR0mhba4-pHT0AA.png',
//     'https://a.thumbs.redditmedia.com/kIpBoUR8zJLMQlF8azhN-kSBsjVUidHjvZNLuHDONm8.png',
//     'https://www.redditstatic.com/desktop2x/img/powerups/moderator-achievement.svg',
//     'https://www.redditstatic.com/desktop2x/img/loading.gif',
//     'https://www.redditstatic.com/desktop2x/img/powerups/powerups-rangers.png',
//     'https://styles.redditmedia.com/t5_6gfz1o/styles/profileIcon_snoo4b14e691-8ab0-4856-b738-370468248769-headshot.png?width=256&height=256&frame=1&crop=256:256,smart&s=9eeacd2243f165b8adce9aec7aa14f6bbcd34c5c',
//     'https://styles.redditmedia.com/t5_pmgit/styles/profileIcon_snooc5f89ebf-0be7-4abf-aa0e-7d84e2c2c9cc-headshot.png?width=256&height=256&frame=1&crop=256:256,smart&s=ed36c33e05e7a26d9e2a0e7eecbf04927e4178da',
//     'https://styles.redditmedia.com/t5_5y0pal/styles/profileIcon_snoo2b0d34e4-3fe1-4200-8c74-3aeed19d3173-headshot.png?width=256&height=256&frame=1&crop=256:256,smart&s=110992edf3d4e4c6d9c366cae1081730e1141d0b',
//     'https://styles.redditmedia.com/t5_4xm8rb/styles/profileIcon_snoo9bff3bf2-f193-4ad6-8259-bae9d43675ce-headshot.png?width=256&height=256&frame=1&crop=256:256,smart&s=37f009d6055a9d9453b67222ee276bfb56ca938d',
//     'https://styles.redditmedia.com/t5_1zh6re/styles/profileIcon_snooe7fb9e3c-db2b-4eed-a296-ab2322a76d5c-headshot.png?width=256&height=256&frame=1&crop=256:256,smart&s=8ec01fc243a55743aff2e063b814ff7d2e389d36',
//     'https://styles.redditmedia.com/t5_36nhdw/styles/profileIcon_u4d88dqnmc191.jpeg?width=256&height=256&frame=1&crop=256:256,smart&s=6b10dd9c59b6543a2ebfdc7bfe6b847db24834ed',
//     'https://styles.redditmedia.com/t5_202xpu/styles/profileIcon_snoo2b72f28f-6366-4fdf-ac04-2f26879e7d67-headshot.png?width=256&height=256&frame=1&crop=256:256,smart&s=5ecb8af4776faabc5871d16c721abb20f01b6d6b',
//   ],
//   content_filters: [
//     'biden',
//     'hackers',
//     'slain',
//     'gunpoint',
//     'swastikas',
//     'bullets',
//     'standoff',
//     'beatings',
//     'assassination',
//     'accused',
//     'trump',
//     'biden',
//     'violence',
//     'allegations',
//     'sentenced',
//     'republicans',
//     'prison',
//     'arrested',
//     'charged',
//     'covid',
//     'pandemic',
//     'crash',
//     'crime',
//     'crisis',
//     'killing',
//     'kill',
//     'senator',
//     'taliban',
//     'vote',
//     'fbi',
//     'gop',
//     'supreme court',
//     'police',
//     'death',
//     'democrat',
//     'cnn',
//     'gorilla'
//   ],
// }
