import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Institution } from '../institution';
import { Resource } from '../resource';
import { ResourceType } from '../resourceType';
import { User } from '../user';
declare const addeventatc: any;

@Component({
  selector: 'app-resource-tile',
  templateUrl: './resource-tile.component.html',
  styleUrls: ['./resource-tile.component.scss'],
})
export class ResourceTileComponent implements OnInit {
  @Input() resource: Resource;
  @Input() user: User;

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(function () {
      addeventatc.refresh();
    }, 200);
  }

  handleClick($event) {
    console.log('\n\n\n=== handleClick ===\n\n\n');

    $event.preventDefault();
    $event.stopPropagation();
  }

  resourceRoute(resource: Resource) {
    return ['/resource', resource.id];
  }

  goInstitution($event, institution: Institution) {
    $event.preventDefault();
    this.router.navigateByUrl(`/search/filter?Institution=${institution.name}`);
  }

  goResourceType($event, type: ResourceType) {
    $event.preventDefault();
    this.router.navigateByUrl(`/search/filter?Type=${type.name}`);
  }

  getResourceDescText() {
    const temp = document.createElement('div');
    temp.innerHTML = this.resource.description;
    return temp.textContent || temp.innerText || '';
    // return this.resource.description.replace(/<\/?[^>]+>/gi, ' ');
  }

  typeIconId(resource: Resource) {
    return (
      resource && resource.type && resource.type.icon && resource.type.icon.id
    );
  }

  truncateWords(str: string, numWords: number) {
    if (str) {
      const maxChars = 36 * 3;
      const allWords = str.split(' ');
      const someWords = allWords.slice(0, numWords);
      if (allWords.length > someWords.length) {
        const someStr = someWords.join(' ');

        if (someStr.length + 3 > maxChars) {
          return this.truncateWords(someStr, numWords - 1);
        } else {
          return someStr + '...';
        }
      }
    }
    return str;
  }
}
