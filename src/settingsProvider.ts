import { Injectable } from '@angular/core'
import { SettingsTabProvider } from 'tabby-settings'
import { ProfileShareComponent } from './share.component'

@Injectable()
export class ProfileShareSettingsProvider extends SettingsTabProvider {
    id = 'profile-share'
    title = 'Profile Sharing'
    icon = 'share-alt'
    weight = 200
    getComponentType (): any { return ProfileShareComponent }
}
