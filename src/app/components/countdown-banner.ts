import { Component } from "@angular/core";
import { UpdateService } from "../services/update.service";

@Component({
  selector: "app-countdown-banner",
  standalone: true,
  template: `
    @if (updateService.updatePending()) {
      <div
        class="bg-yellow-600 text-white px-4 py-2 text-center text-sm font-medium z-[100] relative"
      >
        System Update Pending: Restarting in {{ updateService.countdown() }}
        seconds...
      </div>
    }
  `,
})
export class CountdownBannerComponent {
  constructor(public updateService: UpdateService) {}
}
