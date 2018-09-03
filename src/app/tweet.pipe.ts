import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { Tweet } from './tweet';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'tweet'
})
export class TweetPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(tweet: Tweet, args?: any): any {
    let text = this.sanitizer.sanitize(SecurityContext.NONE, tweet.body);

    if (tweet.hashtags) {
      tweet.hashtags.forEach(tag => {
        text = text.replace(new RegExp(`${tag}`, 'gi'), `<span class="has-text-primary">${tag}</span>`);
      });
    }
              
    // Replace screen names with links
    if (tweet.mentions) {
      tweet.mentions.forEach(mention => {
        text = text.replace(new RegExp(`${mention}`, 'gi'), `<a href="https://twitter.com/${mention}" target="_blank" class="has-text-info">${mention}</a>`);
      });
    }

    // Replace links with clickable links
    if (tweet.urls) {
      tweet.urls.forEach(url => {
        text = text.replace(url.url, `<a href="${url.url}" target="_blank">${url.display_url}</a>`);
      });
    }
    
    // Remove media urls since we display them
    if (tweet.media) {
      tweet.media.forEach(url => {
        text = text.replace(url.url, '');
      });
    }

    // Replace newline characters
    text = text.replace(/\n/gm, '<br />');

    return this.sanitizer.bypassSecurityTrustHtml(text);
  }

}
