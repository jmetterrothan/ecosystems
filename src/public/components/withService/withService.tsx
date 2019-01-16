import React from 'react';

const withService = (BaseComponent) => (services) => (
  <BaseComponent {...services} />
);

export default withService;
