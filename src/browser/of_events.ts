/*
Copyright 2017 OpenFin Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import { EventEmitter } from 'events';

class OFEvents extends EventEmitter {
    constructor() {
        super();
    }

    public emit(route: string, ...data: any[]) {
        const tokenizedRoute = route.split('/');

        if (tokenizedRoute.length >= 2) {
            const [channel, topic] = tokenizedRoute;
            const source = tokenizedRoute.slice(2).join('/');
            const envelope = {channel, topic, source, data};

            // Wildcard on all topics of a channel (such as on the system channel)
            super.emit(`${channel}/*`, envelope);

            if (source) {
                // Wildcard on any source of a channel/topic (ex: 'window/bounds-changed/*')
                super.emit(`${channel}/${topic}/*`, envelope);

                // Wildcard on any channel/topic of a specified source (ex: 'window/*/myUUID-myWindow')
                super.emit(`${channel}/*/${source}`, envelope);
            }
        }

        return super.emit(route, ...data);
    }
}

export default new OFEvents();
