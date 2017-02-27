/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  SpellBase,
  SpellResult,
  DefaultDisplayType,
} from 'zeppelin-spell';

import 'jsoneditor/dist/jsoneditor.min.css'
import JSONEditor from 'jsoneditor/dist/jsoneditor.min.js'

export default class JsonSpell extends SpellBase {
  constructor() {
    super("%json");
  }

  interpret(paragraphText) {
    let editor = { instance : null } /** for closure in `onModeChange` */
    const options = {
      mode: 'view',
      modes: ['view', 'tree'],
      search: true,
      onError: function(error) {
        console.error(`JSONEditor throw an error`, error)
      },
      onModeChange: function(newMode, oldMode) {
        if (editor.instance) { editor.instance.expandAll() }
      },
    };

    const callback = (elemId => {
      const container = document.getElementById(elemId)
      editor.instance = new JSONEditor(container, options);

      try {
        const json = JSON.parse(paragraphText)
        editor.instance.set(json)
        editor.instance.expandAll()
        editor.instance.focus()
      } catch (error) {
        console.error(`Failed to parse JSON`, error)
      }
    })

    return new SpellResult(callback);
  }
}
