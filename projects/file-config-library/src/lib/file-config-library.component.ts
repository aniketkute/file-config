import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-file-config-library',
  standalone: true,
  imports: [HeaderComponent, FormsModule],
  templateUrl: `./file-config-library.component.html`,
  styleUrl: `./file-config-library.component.scss`,
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
