import { Component, Input, forwardRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms'

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './input.html',
  styleUrls: ['./input.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() id: string = ''
  @Input() label: string = ''
  @Input() name: string = ''
  @Input() autocomplete: string = 'off'
  @Input() type: string = 'text'
  @Input() min?: string

  private _value: string = ''
  get value(): string {
    return this._value
  }
  set value(val: string) {
    if (val !== this._value) {
      this._value = val
      this.onChange(val)
    }
  }
  disabled = false

  onChange = (value: any) => {}
  onTouched = () => {}

  writeValue(value: any): void {
    this._value = value || ''
  }
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }
}
