import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Institution } from '../institution';
import { Project } from '../commons-types';
import { ResourceType } from '../resourceType';
import { User } from '../user';
declare const addeventatc: any;

@Component({
  selector: 'app-commons-project-tile',
  templateUrl: './commons-project-tile.component.html',
  styleUrls: ['./commons-project-tile.component.scss']
})
export class CommonsProjectTileComponent implements OnInit {
  @Input() project: Project;
  @Input() user: User;
  @Input() projectChange = new EventEmitter();

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(function() {
      addeventatc.refresh();
    }, 200);
  }

  handleClick($event) {
    console.log('\n\n\n=== handleClick ===\n\n\n');

    $event.preventDefault();
    $event.stopPropagation();
  }

  showNext() {
    this.projectChange.emit({
      currentProject: this.project,
      displayForm: 'commons-project'
    });
  }

  goInstitution($event, institution: Institution) {
    $event.preventDefault();
    this.router.navigateByUrl(`/search/filter?Institution=${institution.name}`);
  }

  goProjectType($event, type: ResourceType) {
    $event.preventDefault();
    this.router.navigateByUrl(`/search/filter?Type=${type.name}`);
  }

  typeIconId(project: Project) {
    return project && project.icon && project.icon.id;
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
