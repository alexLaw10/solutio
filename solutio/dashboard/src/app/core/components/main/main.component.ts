import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'solutio-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {}

