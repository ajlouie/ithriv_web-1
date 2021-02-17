import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../category';
import { NodeOptions } from '../../node-options';
import { hexColorToRGBA } from '../../shared/color';

@Component({
  selector: '[app-node]',
  templateUrl: './node.component.svg',
  styleUrls: ['./node.component.scss'],
})
export class NodeComponent implements OnInit {
  @Input() category: Category;
  @Input() numTotal: number;
  @Input() options: NodeOptions;
  @Input() state: string;
  strokeWidth = 4;
  iconSize = 24;
  fontSize = 16;
  loading = false;

  constructor(private router: Router) {
    console.log(`==== NodeComponent constructor ====
category = ${this.category}
numTotal = ${this.numTotal}
options = ${this.options}
state = ${this.state}
loading = ${this.loading}
    `);
  }

  ngOnInit() {
    this.loading = true;
    console.log(`==== NodeComponent ngOnInit ====
category = ${this.category}
numTotal = ${this.numTotal}
options = ${this.options}
state = ${this.state}
loading = ${this.loading}
    `);
  }

  rotate(angle: number) {
    console.log('--- rotate ---');
    return `rotate(${angle})`;
  }

  scale(factor: number) {
    console.log('--- scale ---');
    return `scale(${factor})`;
  }

  translate(x: number, y: number) {
    console.log('--- translate ---');
    return `translate(${x}, ${y})`;
  }

  translateAndScale() {
    console.log('--- translateAndScale ---');
    const scale = this.category.hover ? 1.1 : 1;
    return `
      ${this.translate(this.options.x, this.options.y)}
      ${this.scale(scale)}
    `;
  }

  categoryColor(hexColor: string, alpha = 1) {
    console.log('--- categoryColor ---');
    return hexColorToRGBA(hexColor, alpha);
  }

  nodeGradient(node: Category) {
    console.log('--- nodeGradient ---');
    return `url(#linear-${node.id})`;
  }

  nodeImageSize() {
    console.log('--- nodeImageSize ---');
    return (this.options.radius - this.strokeWidth) * 2 - this.strokeWidth;
  }

  nodeImagePath(c: Category) {
    console.log('--- nodeImagePath ---');
    if (c && c.image) {
      return `/assets/browse/${c.image}`;
    } else {
      return `/assets/logo/ithriv-logomark.png`;
    }
  }

  words(str: string) {
    console.log('--- words ---');
    console.log(`words: "${str}"`);
    return str.trim()
      .replace('  ', ' ')
      .replace(/ of /i, ' of_')
      .replace(/ for /i, ' for_')
      .replace(/ to /i, ' to_')
      .replace(/ and /i, ' &_')
      .split(' ')
      .map(s => {
        return s
          .replace('of_', 'of ')
          .replace('for_', 'for ')
          .replace('to_', 'to ')
          .replace('&_', '& ');
      });
  }

  translateText(c: Category) {
    console.log('--- translateText ---');
    const scale = (this.options.relationship === 'self') ? 2 : 1;
    if (c.level === 1) {
      return `translate(0, ${this.iconSize * scale})`;
    } else {
      return `translate(0, -${this.fontSize})`;
    }
  }

  translateIcon() {
    console.log('--- translateIcon ---');
    const scale = 3;
    const xOffset = this.options.x - this.iconSize * scale / 2;
    const yOffset = -this.iconSize * (scale - 0.5);
    return `
      ${this.translate(xOffset, yOffset)}
      ${this.scale(scale)}
    `;
  }

  getLoadingMessage() {
    console.log('--- getLoadingMessage ---');
    return '...';
  }
}
