import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'solutio-v2-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  @Input() form!: FormGroup;
  @Input() loading = false;
  @Input() minDate = '';
  @Input() maxDate = '';
  @Input() cityOptions: Array<{ label: string; value: string }> = [];

  @Output() startChange = new EventEmitter<Event>();
  @Output() endChange = new EventEmitter<Event>();
  @Output() cityChange = new EventEmitter<Event>();
  @Output() submitFilter = new EventEmitter<Event>();

  onSubmit(event: Event): void {
    this.submitFilter.emit(event);
  }
}
