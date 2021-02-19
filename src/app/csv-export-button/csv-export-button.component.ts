import { Component, Input } from '@angular/core';
import { Angular2CsvComponent, Options } from 'angular2-csv';

@Component({
  selector: 'app-csv-export-button',
  templateUrl: './csv-export-button.component.html',
  styleUrls: ['./csv-export-button.component.css']
})
export class CsvExportButtonComponent extends Angular2CsvComponent {
  @Input() data: any[];
  @Input() filename: string;
  @Input() options: Options;
  @Input() label_btn: string;
  @Input() csv: string;
}
