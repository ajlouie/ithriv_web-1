import { Component, Input, OnInit } from '@angular/core';

export interface ParsedError {
  title: string;
  errors: ErrorMessage[];
}

export interface ErrorMessage {
  title: string;
  messages: string[];
}

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent implements OnInit {
  @Input() errorString: any;
  title: string;
  message: string;
  errors: ErrorMessage[] = [];

  constructor() {
  }

  ngOnInit() {
    this.parseError();
  }

  parseError() {
    if (typeof this.errorString === 'string') {
      const patternJson = /^{"title":"([^"]+)","errors":\[(.*)]}]}$/;
      const patternMulti = /^([^{]+): {"message":"(.*) Error:(.*)"}\W+$/;
      const patternShort = /^([^{]+): {"message":"(.*)"}\W+$/;

      if (patternJson.test(this.errorString)) {
        const parsedError: ParsedError = JSON.parse(this.errorString);
        this.title = parsedError.title;
        this.errors = parsedError.errors;
      } else if (patternMulti.test(this.errorString)) {
        patternMulti.lastIndex = 0; // Reset the regex
        const results = patternMulti.exec(this.errorString);
        if (results && results.length === 4) {
          this.title = results[1];
          this.message = results[2];

          const arrayPattern = /{'([^':]+)': \[\\"([^\\"]+)\\"\]}/g;
          const errors = results[3];
          if (arrayPattern.test(errors)) {
            arrayPattern.lastIndex = 0; // Reset the regex
            const arrayPatternResults = arrayPattern.exec(errors);

            if (arrayPatternResults && arrayPatternResults.length >= 3) {
              const matches = arrayPatternResults.slice(1); // Get all but the first item.

              // Even indexes will be keys. Odd indexes will be values:
              for (let i = 0; i < matches.length; i += 2) {
                const messages = matches[i + 1].split(/"],\W+\["/);
                console.log('messages', messages);

                this.errors.push({
                  title: matches[i],
                  messages,
                });
              }
            } else {
              this.message = this.errorString;
            }
          }
        }
      } else if (patternShort.test(this.errorString)) {
        patternShort.lastIndex = 0; // Reset the regex
        const results = patternShort.exec(this.errorString);

        if (results && results.length === 3) {
          this.title = results[1];
          this.message = results[2];
        }
      } else {
        this.message = this.errorString;
      }
    }
  }

  addColon(title: string): string {
    if (title.charAt(title.length - 1) !== ':') {
      return title + ':';
    } else {
      return title;
    }
  }
}
