import React from 'react';
export interface IUIState {
  component: React.Component;
  init(): void;
  process(): void;
}
