import { Component, Input, OnInit } from '@angular/core';
import { Institution } from '../institution';
import { Resource } from '../resource';
import { ResourceApiService } from '../shared/resource-api/resource-api.service';
import { User } from '../user';

@Component({
  selector: 'app-favorite-resource-list',
  templateUrl: './favorite-resource-list.component.html',
  styleUrls: ['./favorite-resource-list.component.scss']
})
export class FavoriteResourceListComponent implements OnInit {
  resources: Resource[];
  @Input() user: User;
  @Input() institution: Institution;
  @Input() tabIndex: number;

  constructor(private api: ResourceApiService) {
    this.resources = [];
    this.getFavoriteResources();
  }

  getFavoriteResources() {
    this.api.getUserFavorites().subscribe(favs => {
      favs.forEach(f => {
        this.resources.push(f.resource);
      });
      // this.resources = favs.map(f => f.resource);
    });
  }

  ngOnInit() {
  }
}
