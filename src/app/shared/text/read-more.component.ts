import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'cb-read-more',
    template: `<p class='break-wrap mb0' style='white-space: pre-wrap;' [hidden]='fullText' [innerHTML]='rmTextShort'></p><p class='break-wrap mb5' style='white-space: pre-wrap' [hidden]='!fullText' [innerHTML]='rmTextFull'></p><p class='mb0'><small><a href='javascript:;' class='text-primary' (click)='readMore(true)' [hidden]='!showMore'>{{'Exibir mais'}}</a><a href='javascript:;' (click)='readMore(false)' class='text-primary' [hidden]='!showLess'>Ocultar</a></small></p>`,
})
export class ReadMoreComponent implements OnChanges {
    @Input() text: string;
    fullText = true;
    showMore = false;
    showLess = false;
    rmTextShort = '';
    rmTextFull = '';
    inputWords = [];
    constructor() {
    }

    readMore(flag) {
        if (flag) {
            this.showMore = false;
            this.fullText = true;
            this.rmTextFull = this.text;
            this.showLess = true;
        } else {
            this.showLess = false;
            this.showMore = true;
            this.fullText = false;
        }
    }

    ngOnChanges () {
        this.rmTextShort = this.text;
        this.rmTextFull = this.text;
        this.inputWords = this.text.split(' ');
        if (this.inputWords.length > 2) {
            this.fullText = false;
            this.showMore = true;
            this.rmTextShort = this.inputWords.slice(0, 2).join(' ') + '...';
        } else {
            if (this.rmTextShort.length > 100) {
                this.fullText = false;
                this.showMore = true;
                this.rmTextShort = this.rmTextShort.substr(0, 100) + '...'
            } else {
                const lineBreaks = this.rmTextShort.split(/\n/g)
                if (lineBreaks.length > 4) {
                    this.fullText = false
                    this.showMore = true
                    this.rmTextShort = lineBreaks.slice(0, 4).join('\n') + '...'
                }
            }
        }
    }
}
