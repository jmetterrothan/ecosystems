import React from 'react';
import ReactDOM from 'react-dom';

import UIManager from '@ui/UIManager';
import SoundManager from '@shared/SoundManager';

import Builder_Game_Item_Click_1 from '@sounds/Builder_Game_Item_Click_1.mp3';
import Unlock_level_Game_Sound from '@sounds/Unlock_level_Game_Sound.mp3';
import Set_Down_Item_1 from '@sounds/Set_Down_Item_1.mp3';
import Small_Splash from '@sounds/Small_Splash.mp3';
import Bubbles from '@sounds/Bubbles.mp3';

SoundManager.add('click', Builder_Game_Item_Click_1, { volume: 0.5 });
SoundManager.add('trophy_unlock', Unlock_level_Game_Sound, { volume: 0.5 });
SoundManager.add('set_down', Set_Down_Item_1, { volume: 0.5 });
SoundManager.add('splash', Small_Splash, { volume: 0.5 });
SoundManager.add('bubbles', Bubbles, { volume: 0.5 });

ReactDOM.render(<UIManager />, document.getElementById('root'));
