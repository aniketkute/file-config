import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-dashboard-ui',
  standalone: true,
  imports: [HeaderComponent, FormsModule],
  templateUrl: `./dashboard-ui.component.html`,
  styleUrl: `./dashboard-ui.component.scss`,
})
export class DashboardUiComponent {
  menus: any = [
    {
      Name: 'pd',
      isActive: false,
    },
  ];
  styleSketchNumber: string | null = null;

  itemSelected(item: any) {
    console.log(item);
  }
}
