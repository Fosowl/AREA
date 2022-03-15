import React from 'react';
import { service } from './Service';
import { widget } from './Widget';
import { OAuth } from './Account';

const api = {
    oauth: OAuth,
    widget: widget,
    service: service,
}

export default api;