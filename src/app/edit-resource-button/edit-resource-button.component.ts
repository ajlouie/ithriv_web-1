import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Category } from "../category";
import { Resource } from "../resource";
import { User } from "../user";

@Component({
  selector: "app-edit-resource-button",
  templateUrl: "./edit-resource-button.component.html",
  styleUrls: ["./edit-resource-button.component.scss"]
})
export class EditResourceButtonComponent implements OnInit {
  @Input() resource: Resource;
  @Input() category: Category;
  @Input() user: User;

  constructor(private router: Router) {}

  ngOnInit() {}

  openEdit() {
    this.router.navigateByUrl(
      `<segment>/${this.resource.id}/edit`.replace(
        // tslint:disable-next-line: quotemark
        "<segment>",
        this.resource.segment.name.toLowerCase()
      )
    );
  }

  userMayEdit() {
    return this.resource.user_may_edit;
  }
}
