import { CommonModule } from '@angular/common';
import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-submit-predictions-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './submit-predictions-modal.component.html',
  styleUrl: './submit-predictions-modal.component.less'
})
export class SubmitPredictionsModalComponent {
  @Input() public showColor: boolean = true;
  @Input() public playerName: string = "";
  @Input() public submitCallback: Function = () => {};
  @Input() public readyToSubmit: boolean = false;
  @Output() public nameChange: EventEmitter<string> = new EventEmitter<string>();
  public colorSelection: string = "";
  public nameError: boolean = false;
  public colorError: boolean = false;

  nameChanged(value: string) {
    this.nameChange.emit(value);
  }

  submitFunction() {
    if (this.showColor === false) {
      this.submitCallback(this.playerName);
    } else {
      this.submitCallback(this.playerName, this.colorSelection);
    }
  }
}
