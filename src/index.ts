import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { SettingsTabProvider } from 'tabby-settings'
import { ProfileShareSettingsProvider } from './settingsProvider'
import { ProfileShareComponent } from './share.component'

@NgModule({
    imports: [CommonModule, FormsModule, NgbModule],
    declarations: [ProfileShareComponent],
    providers: [{ provide: SettingsTabProvider, useClass: ProfileShareSettingsProvider, multi: true }],
})
export default class TabbyProfileShareModule {}
