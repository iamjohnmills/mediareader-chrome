
class Store {
  constructor(options) {
    this.feeds = [];
    this.filters_media = [];
    this.filters_content = [];
  }
  async initialize(){
    await this.initializeFeeds();
    await this.initializeMediaFilters();
    await this.initializeContentFilters();
    return;
  }
  async clearFeeds(){
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({feeds: []}, () => {
        this.feeds = [];
        return resolve(true);
      });
    });
    // chrome.storage.local.remove(['feeds'], (result) => { this.feeds = [] });
  }
  async clearMediaFilters(){
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({filters_media: []}, () => {
        this.filters_media = [];
        return resolve(true);
      });
    });
    // chrome.storage.local.remove(['filters_media'], (result) => { this.filters_media = [] });
  }
  async clearContentFilters(){
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({filters_content: []}, () => {
        this.filters_content = [];
        return resolve(true);
      });
    });
    // chrome.storage.local.remove(['filters_content'], (result) => { this.filters_content = [] });
  }
  initializeFeeds(){
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('feeds', (result) => {
        if(Object.keys(result).length !== 0) this.feeds = result.feeds;
        return resolve(true);
      });
    });
  }
  initializeMediaFilters(){
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('filters_media', (result) => {
        if(Object.keys(result).length !== 0) this.filters_media = result.filters_media;
        return resolve(true);
      });
    });
  }
  initializeContentFilters(){
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('filters_content', (result) => {
        if(Object.keys(result).length !== 0) this.filters_content = result.filters_content;
        return resolve(true);
      });
    });
  }
  saveFeeds(){
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({feeds: this.feeds}, () => {
        return resolve(true);
      });
    });
  }
  saveMediaFilters(){
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({filters_media: this.filters_media}, () => {
        return resolve(true);
      });
    });
  }
  saveContentFilters(){
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({filters_content: this.filters_content}, () => {
        return resolve(true);
      });
    });
  }
  getFeeds(){
    return this.feeds.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
  async importOPML(xml){
    const outlines = Array.from(xml.querySelectorAll('outline')).filter(node => node.getAttribute('xmlUrl'));
    for(const outline of outlines){
      const url = outline.getAttribute('xmlUrl');
      const exists = this.feeds.findIndex(feed => feed.url === url) !== -1;
      if(exists) continue;
      const created_at = new Date();
      const feed = { url: url, created_at: created_at.toISOString() };
      await this.feeds.push(feed);
    }
    return await this.saveFeeds();
  }
  async exportFeedsOPML(){
    const outlines = await this.getFeeds().reduce((xml,feed) => {
      return `${xml}<outline text="${feed.url}" xmlUrl="${feed.url}" />`;
    },'');
    return `<?xml version="1.0" encoding="UTF-8"?><opml version="2.0"><head><title>OPML file for MediaReader</title></head><body>${outlines}</body></opml>`;
  }
  async createFeed(feed_url){
    const exists = this.feeds.findIndex(feed => feed.url === feed_url) !== -1;
    if(exists) return false;
    const created_at = new Date();
    const feed = { url: feed_url, created_at: created_at.toISOString() };
    await this.feeds.push(feed);
    return await this.saveFeeds();
  }
  async removeFeed(feed_url){
    const index = this.feeds.findIndex(feed => feed.url === feed_url);
    await this.feeds.splice(index,1);
    this.filters_media = await this.filters_media.filter(filter => filter.feed !== feed_url);
    await this.saveMediaFilters();
    await this.saveFeeds();
    return;
  }
  async createMediaFilter(rule,feed_url){
    const exists = this.filters_media.findIndex(filter => filter.rule === rule && filter.feed === feed_url) !== -1;
    if(exists) return false;
    const created_at = new Date();
    const filter = { rule: rule, feed: feed_url, created_at: created_at.toISOString() };
    await this.filters_media.push(filter);
    return await this.saveMediaFilters();
  }
  async removeMediaFilter(rule,feed_url){
    const index = this.filters_media.findIndex(filter => filter.rule === rule && filter.feed === feed_url);
    await this.filters_media.splice(index,1);
    return await this.saveMediaFilters();
  }
  async createContentFilter(rule){
    const exists = this.filters_content.findIndex(filter => filter.rule === rule) !== -1;
    if(exists) return false;
    const created_at = new Date();
    const filter = { rule: rule, created_at: created_at.toISOString() };
    await this.filters_content.push(filter);
    return await this.saveContentFilters();
  }
  async removeContentFilter(rule){
    const index = this.filters_content.findIndex(filter => filter.rule === rule);
    await this.filters_content.splice(index,1);
    return await this.saveContentFilters();
  }
  getMediaFilters(feed_url){
    return this.filters_media.filter(filter => !feed_url || (feed_url && filter.feed === feed_url)).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
  getContentFilters(){
    return this.filters_content.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}
