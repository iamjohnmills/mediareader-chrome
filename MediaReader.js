class MediaReader {
  constructor(){
  }
  /**
   * @typedef headers
   * @property {string} type - The mimetype from the headers
   * @property {number} size - The size from the headers
   */
  /**
   *  Get the response text of URL
   *  @param {string} url - A URL
   *  @param {string} method - A method to use: eg. GET
   *  @param {boolean} binary - True to get response as binary
   *  @returns {(Promise|Promise<headers>)} - Promise object containing the response text or the headers
   */
  async getURL(url,method='GET',binary=false){
    var xhr = new XMLHttpRequest();
    return new Promise(function(resolve,reject){
      if(!url.startsWith('http')) return reject({ statusText: 'Invalid URL' });
      xhr.onreadystatechange = function(){
        if(xhr.readyState !== 4) return;
        if(xhr.status >= 200 && xhr.status < 300){
          if(method == 'HEAD'){
            return resolve({
              type: xhr.getResponseHeader('Content-Type'),
              size: parseInt(xhr.getResponseHeader('Content-Length')),
            })
          } else {
            return resolve(xhr.responseText);
          }
        } else {
          return reject({
            url: url,
            status: xhr.status,
            statusText: xhr.statusText ? xhr.statusText : 'Error getting URL',
          });
        }
      }
      if(binary){
        xhr.overrideMimeType('text/plain; charset=x-user-defined');
      }
      xhr.open('GET', url);
      xhr.timeout = 10000;
      xhr.send();
    });
  }

  /**
   *  Determine if a gif image is animated
   *  source: https://gist.github.com/zakirt/faa4a58cec5a7505b10e3686a226f285
   *  @param {array} buffer - A Uint8Array of the image buffer data
   *  @returns {boolean} - True is animated; False is static
   */
  is_gif_animated(buffer){
    var dv = new DataView(buffer, 10);
    var offset = 0;
    var globalColorTable = dv.getUint8(0);
    var bgColorIndex = dv.getUint8(1);
    var pixelAspectRatio = dv.getUint8(2);
    var globalColorTableSize = 0;
    if (globalColorTable & 0x80) {
      globalColorTableSize = 3 * Math.pow(2, (globalColorTable & 0x7) + 1);
    }
    offset = 3 + globalColorTableSize;
    var extensionIntroducer = dv.getUint8(offset);
    var graphicsConrolLabel = dv.getUint8(offset + 1);
    var delayTime = 0;
    if ((extensionIntroducer & 0x21) && (graphicsConrolLabel & 0xF9)) {
      delayTime = dv.getUint16(offset + 4);
    }
    return delayTime ? true : false;
  }

  /**
   *  Get the HTML element of an image
   *  @param {string} dataurl - A DOMstring of the data URL.
   *  @returns {(Promise<HTMLElement>|boolean)} Promise containing image properties or false
   */
  get_image(dataurl){
    return new Promise(async (resolve,reject) => {
      var img = new Image();
      img.src = dataurl;
      img.onload = () => {
        return resolve(img);
      }
    })
  }

  /**
   *  Determines if an image is animated
   *  @param {string} mime - The file mimetype
   *  @param {string} binary - A binary data string of the image
   *  @param {array} buffer - A Uint8Array of the image buffer data
   *  @returns {boolean} - True if animated
   */
  async is_animated(mime,binary,buffer){
    if(mime == 'image/gif'){
      return await this.is_gif_animated(buffer); // check if gif animated with buffer
    } else if(mime == 'image/webp'){
      return binary.indexOf('ANMF') != -1; // check if webp animated with binary
    }
  }

  /**
   *  Determines if a PNG image has a transparent pixel
   *  @param {array} buffer - A Uint8Array of the image buffer data
   *  @returns {boolean} - True if transparent
   */
   has_alpha(buffer) {
    for (var i = 3; i < buffer.length; i+=4) {
      if (buffer[i] < 255) {
        return true;
      }
    }
    return false;
  }

  /**
   *  Gets a scaled canvas element from an image
   *  @param {string} width - The width of the destination canvas
   *  @param {string} height - The height of the destination canvas
   *  @param {HTMLElement} image_obj - The image element
   *  @param {boolean} [preserve_ratio] - True to preserve image aspect ratio when scaling
   *  @returns {HTMLElement} - The generated canvas element
   */
  get_canvas(image_obj,width,height,preserve_ratio=true){
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width',width);
    canvas.setAttribute('height',height);
    if(preserve_ratio){
      var xRatio = canvas.width / image_obj.naturalWidth;
      var yRatio = canvas.height / image_obj.naturalHeight;
      var ratio = Math.min(yRatio, xRatio);
      canvas.width = ratio < 1 ? parseInt(image_obj.naturalWidth * ratio) : image_obj.naturalWidth;
      canvas.height = ratio < 1 ? parseInt(image_obj.naturalHeight * ratio) : image_obj.naturalHeight;
    }
    canvas.getContext('2d').drawImage(image_obj, 0, 0, image_obj.naturalWidth, image_obj.naturalHeight, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  /**
   *  @typedef    {Object}  media
   *  @property   {string}  media.url - The URL. ex: https://someurl.com/image.gif
   *  @property   {string}  media.type - The type of media. ex: image
   *  @property   {string}  media.ext - The file extension of the media. ex: gif I only use this to identify gifv files, which are mp4s
   *  @property   {string}  media.mime - The mimetype of the media. ex: image/gif
   *  @property   {string}  [media.dataurl] - A DOMstring of the data URL. I use this to display a scaled version of the image and/or animated images.
   *  @property   {array}   [media.xs_buffer] - A Uint8ClampedArray of the image to use in duplicate comparisons
   *  @property   {string}  [media.xs_dataurl] - A DOMstring of the data URL to use in duplicate comparisons
   *  @property   {string}  [media.brand] - The source of the embed
   *  @property   {string}  [media.height] - The embed height to set the iframe to
   */
  /**
   *  Gets additional data for a media object
   *  @param {object} media_obj
   *  @param {string} media_obj.url - A URL
   *  @param {string} media_obj.type - The type of media. ex: image
   *  @param {string} media_obj.ext - The file extension of the media. ex: gif
   *  @param {string} media_obj.mime - The mimetype of the media. ex: image/gif
   *  @returns {(media|boolean)}
   */
  async downloadMedia(media_obj){
    try {
      if(typeof media_obj == 'undefined') throw { message: 'No media object provided.' };
      if( media_obj.type !== 'image' || media_obj.ext == 'svg' ) return media_obj;
      var headers = await this.getURL(media_obj.url,'HEAD');
      if( headers.type == 'video/mp4' && media_obj.mime !== 'video/mp4'){ // because sometimes gifs wanna be mp4s
        media_obj.type = 'video';
        media_obj.mime = 'video/mp4';
        return media_obj;
      }
      if( !headers.type.includes('image') && !headers.type.includes('octet-stream') ) throw { message: 'Header content-type not an image.', headers: headers, media_obj: media_obj };
      if( headers.size < 10000 ) throw { message: 'File size too small.', headers: headers, media_obj: media_obj };
      if( headers.size > 10000000 ) throw { message: 'File size too large.', headers: headers, media_obj: media_obj };
      var binary = await this.getURL(media_obj.url,'GET',true);
      var uint8 = await new Uint8Array(binary.length).map((value,i) => binary.charCodeAt(i));
      if( media_obj.mime == 'image/png' && await this.has_alpha(uint8.buffer) ) throw { message: 'PNG Image with transparency not shown.', media_obj: media_obj };
      var dataurl = URL.createObjectURL(new Blob([uint8],{type:media_obj.mime}));
      var animated = await this.is_animated(media_obj.mime,binary,uint8.buffer);
      var image = await this.get_image(dataurl);
      var min_width = animated ? 200 : 230;
      var min_height = 100;
      var min_ratio = 0.43;
      var max_ratio = 3;
      var ratio = image.naturalWidth / image.naturalHeight;
      if( ratio < min_ratio || ratio > max_ratio || image.naturalWidth < min_width || image.naturalHeight < min_height ){
        throw { message: 'Image dimenions out of range.', headers: headers, ratio: ratio, width: image.naturalWidth, height: image.naturalHeight, media_obj: media_obj };
      }
      if(animated){
        media_obj.dataurl = dataurl;
        return media_obj;
      }
      var canvas = await this.get_canvas(image,500,1000);
      media_obj.dataurl = canvas.toDataURL();
      var canvas_xs = await this.get_canvas(image,25,25,false); // for comparing duplicates
      media_obj.xs_buffer = canvas_xs.getContext('2d').getImageData(0,0,canvas_xs.width,canvas_xs.height).data;
      media_obj.xs_dataurl = canvas_xs.toDataURL();
      return media_obj;
    } catch(e) {
      // console.log(e);
      return false;
    }
  }

  /**
   *  Find difference of two buffers by root mean square
   *  @param {array} image.xs_buffer1 - A Uint8ClampedArray buffer of the image
   *  @param {array} image.xs_buffer2 - A Uint8ClampedArray buffer of the image
   *  @returns {number} - Root mean square of the image buffers
   */
  async root_mean_square(buffer1,buffer2){
    var superset = buffer1.length >= buffer2.length ? buffer1 : buffer2;
    var subset = buffer1.length >= buffer2.length ? buffer2 : buffer1;
    var squares = await superset.reduce(function(accumulator,value,i){
      return accumulator += (value - subset[i]) * (value - subset[i])
    }, 0);
    return Math.sqrt(squares / superset.length);
  }

  /**
   *  Compare an image to array of images to determine if unique or duplicate.
   *  @param {media} image
   *  @param {array.<media>} array - The array of images
   *  @returns {boolean} - True if unique; False if duplicate
   */
  async isImageUnique(image,array){
    try {
      if(!image) return false;
      if(!array.length || typeof image.xs_buffer == 'undefined') return true;
      for(var i in array){
        if(typeof array[i].xs_buffer == 'undefined') continue;
        if(array[i].xs_dataurl == image.xs_dataurl) throw 'Image is duplicate. url: ' + image.url + ' match: ' + array[i].url;
        var threshold = await this.root_mean_square(image.xs_buffer,array[i].xs_buffer);
        if(threshold < 25) throw 'Image is duplicate with threshold of '+threshold+'. url: ' + image.url + ' match: ' + array[i].url;
      }
      return true;
    } catch(e) {
      console.log(e);
      return false;
    }
  }

  /**
   *  Get any embedded / iframe URLs
   *  To do: maybe make embeds their own media object
   *  @param {string} string - A string of text
   *  @returns {array<media} - An array of embed objects
   */
  async get_embed_objs(string){
    var embed_sources = [
      { brand: 'tiktok', height: 900, template: 'https://www.tiktok.com/embed/v2/{id}', regexp: /https:\/\/www\.tiktok\.com\/[\w|@]+\/video\/(\d+)/gs },
      { brand: 'instagram', height: 850, template: 'https://www.instagram.com/p/{id}/embed/', regexp: /https:\/\/instagram\.com\/p\/([\d|a-zA-Z|\-|_]+)/gs },
      { brand: 'youtube', height: 280, template: 'https://www.youtube.com/embed/{id}', regexp: /https:\/\/[www.]*youtube\.com\/(?:watch\?v\=|embed\/(?!videoseries))([\d|a-zA-Z|\-|_]+)/gs },
      { brand: 'youtube', height: 280, template: 'https://www.youtube.com/embed/videoseries?list={id}', regexp: /https:\/\/[www.]*youtube\.com\/(?:embed\/videoseries\?list=)([^\"|&]*)/gs },
      { brand: 'twitter', height: 250, template: 'https://platform.twitter.com/embed/index.html?id={id}', regexp: /https:\/\/twitter\.com\/[\w]+\/status\/(\d+)/gs },
      { brand: 'reddit-media', height: 280, template: 'https://www.redditmedia.com/mediaembed/{id}?responsive=true', regexp: /https:\/\/www\.redditmedia\.com\/mediaembed\/(\w+)/gs },
      { brand: 'reddit-video', height: 280, template: 'https://v.redd.it/{id}/DASH_480.mp4', regexp: /https:\/\/v.redd.it\/(\w+)\/DASH_480\.mp4/gs },
      //{ brand: 'reddit-embed', height: 220, template: '{id}?ref_source=embed&amp;ref=share&amp;embed=true', regexp: /(https:\/\/www\.reddit\.com\/r\/(?:[\d|a-zA-Z|\-|_]+)\/comments\/(?:[\d|a-zA-Z|\-|_]+)\/(?:[\d|a-zA-Z|\-|_]+))\//gs },
      { brand: 'imgur', height: 500, template: 'https://imgur.com/{id}/embed', regexp: /https:\/\/imgur\.com\/(\w+)\/embed/gs },
      { brand: 'vimeo', height: 280, template: 'https://player.vimeo.com/video/{id}', regexp: /https:\/\/player\.vimeo\.com\/video\/(\d+)/gs },
    ];
    var embeds = await Promise.all( embed_sources.map(async function(source){ // map sources
      const embed_matches = [...string.matchAll(source.regexp)];
      return await embed_matches.map(function(result){ // map regex matches to my embed structure
        let url = source.template.replace(/{id}/, result[1]);
        //if(source.brand === 'reddit-embed'){
        //  url = url.replace(/reddit\.com/, 'redditmedia.com');
        //}
        return { url: url, type: 'embed', brand: source.brand, height: source.height }
      });
    }) );
    return embeds;
  }

  /**
   *  Get media URLs from HTML nodes
   *  @param {string} string - A string of text with HTML nodes
   *  @returns {array<media>} - An array of media objects
   */
  async get_media_objs(string){
    var media_types = [
      { mime: 'image/svg', type: 'image', ext: 'svg', regexp: /(https?:)?[\/|%|\w|\.|\-]+(\.svg)/i },
      { mime: 'image/jpg', type: 'image', ext: 'jpg', regexp: /(https?:)?[\/|%|\w|\.|\-]+(\.jpg|\.jpeg)/i },
      { mime: 'video/mp4', type: 'video', ext: 'mp4', regexp: /(https?:)?[\/|%|\w|\.|\-]+\.mp4/i },
      { mime: 'video/mp4', type: 'video', ext: 'gifv', regexp: /(https?:)?[\/|%|\w|\.|\-]+\.gifv/i },
      { mime: 'image/gif', type: 'image', ext: 'gif', regexp: /(https?:)?[\/|%|\w|\.|\-]+\.gif(?!\w)/i },
      { mime: 'image/webp', type: 'image', ext: 'webp', regexp: /(https?:)?[\/|%|\w|\.|\-]+\.webp/i },
      { mime: 'video/webm', type: 'video', ext: 'webm', regexp: /(https?:)?[\/|%|\w|\.|\-]+\.webm/i },
      { mime: 'image/png', type: 'image', ext: 'png', regexp: /(https?:)?[\/|%|\w|\.|\-]+\.png/i },
      { mime: 'image/apng', type: 'animated', ext: 'apng', regexp: /(https?:)?[\/|%|\w|\.|\-]+\.apng/i },
    ];
    var html = new DOMParser().parseFromString(string, 'text/html');
    var selector = 'source,img,a,media\\:content,media\\:thumbnail,enclosure'; // meta[property*="image"],[style*="background"]
    var nodes = html.querySelectorAll(selector);
    return await Array.from( await Promise.all( Array.from(nodes).map(async function(node){
      return await Array.from( await Promise.all( Array.from(node.attributes).map(async function(attribute){
        if(!/^(data-|content|src|href|url)/.test(attribute.name)) return false;
        if(attribute.value.startsWith('//')){
          attribute.value = 'https:' + attribute.value;
        }
        if(!/^https?/i.test(attribute.value)) return false;
        // how do I check for urls with no extension
        if(/\s/.test(attribute.value)){ // srcset first value only
          attribute.value = await attribute.value.split(' ')[0];
        }
        var i = await media_types.findIndex(function(media_type){
          return media_type.regexp.test(attribute.value);
        });
        if(attribute.name != 'href' && i < 0){ // get image src values that don't have extensions and set mime to jpeg
          return { url: attribute.value, mime: 'image/jpg', type: 'image', ext: 'jpg' };
        } else if(i < 0){ // no match
          return false;
        }
        return { url: attribute.value, mime: media_types[i].mime, type: media_types[i].type, ext: media_types[i].ext };
      }))).filter(function(attribute,i){
        return !!attribute;
      });
    }))).flat(2);
  }

  /**
   *  Get all media URLs from a string
   *  @param {string} string - A string of text (ideally with HTML nodes)
   *  @param {array<string>} media_url_filters - an array of url strings to exclude
   *  @returns {(array<media>|boolean)} - An array of media objects
   */
  async getMediaInString(string,media_url_filters=[]){
    try {
      if(typeof string == 'undefined') throw 'No string provided.'
      // if(typeof to_merge == 'undefined') to_merge = [];
      var media = await this.get_media_objs(string);
      //var merged = await to_merge.concat(media.flat());
      var embeds = await this.get_embed_objs(string);
      var merged = await media.concat(embeds).flat().filter(item => !this._stringInArray(item.url,media_url_filters) );
      // var merged = await to_merge.concat(media.concat(embeds).flat());
      return [...new Map(merged.map(item => [item.url, item])).values()];
        // return merged.filter((media,i) => {
      //   return merged.findIndex(unique_media => unique_media.url == media.url ) == i;
      // });
    } catch(e) {
      console.log(e);
      throw e;
    }
  }


  /**
   *  Get URL from Feed Node
   *  @param {object} object - An HTML node from a Feed
   *  @returns {string} - A string of the URL to use for linking to the source
   */
  async getUrlFromFeedNode(node){
    const guid = node.querySelector('guid');
    const link = node.querySelector('link');
    const guid_text = guid ? guid.textContent : null;
    const link_text = link ? link.textContent : null;
    const link_href = link ? link.getAttribute('href') : null;
    if(link_text) return link_text;
    if(link_href) return link_href;
    if(guid_text) return guid_text;
    return '';
  }

  /**
   *  Determine if a string is in an array of strings
   *  @param {string} string - A string
   *  @param {arr<array>} arr - an array of strings
   *  @returns {boolean} - True if in array
   */
  _stringInArray(string, arr=[]){
    return arr.some(compare_string => string.toLowerCase().includes(compare_string.toLowerCase()))
  }

  /**
   * @typedef feed_item
   * @property {string} title - The feed item title
   * @property {string} url - The feed item link
   * @property {array<media>} media_objs - An array of media objects
   */
  /**
   *  Parse feed items from string
   *  @param {string} string - A URL
   *  @param {array<string>} content_title_filters - an array of strings to exclude in feed items that include in the title
   *  @param {array<string>} media_url_filters - an array of url strings to exclude from media
   *  @returns {(array<feed_item>|boolean)} - An array of feed item objects
   */
  async parseFeed(string,content_title_filters=[],media_url_filters=[]){
    try {
      if(!string) throw 'No string to parse'
      var parser = new DOMParser();
      var xml = parser.parseFromString(string, 'text/xml');
      if(xml.querySelector('rss') == null && xml.querySelector('feed') == null) throw 'Not a valid feed';
      var item_nodes = xml.querySelectorAll('rss > channel > item, feed > entry');
      const items = await Promise.all( Array.from(item_nodes).filter(node => !this._stringInArray( node.querySelector('title').textContent, content_title_filters) ).map(async (node) => {
        let media_objs_content = await this.getMediaInString(node.textContent,media_url_filters);
        let media_objs_node = await this.getMediaInString(node.innerHTML.replaceAll(/<!\[CDATA\[|\]\]>/gm,''),media_url_filters);
        return {
          title: node.querySelector('title') ? node.querySelector('title').textContent.replace(/<\/?[^>]+(>|$)/g, '') : 'No Title',
          date: node.querySelector('pubDate,published') ? node.querySelector('pubDate,published').textContent.replace(/<\/?[^>]+(>|$)/g, '') : 'No Date',
          url: await this.getUrlFromFeedNode(node),
          media_objs: [...new Map(media_objs_content.concat(media_objs_node).map(item => [item.url, item])).values()],
          // media_objs: await this.getMediaInString(node.innerHTML.replaceAll(/<!\[CDATA\[|\]\]>/gm,''), media_content_objs),
        }
      }));
      return items.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch(e) {
      console.log(e);
      throw e;
    }
  }
}

Object.defineProperty(Array.prototype, 'flat', {
    value: function(depth = 1) {
      return this.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
      }, []);
    }
});
