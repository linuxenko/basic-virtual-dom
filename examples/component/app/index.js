/** @jsx h */
import { component, h } from '../../../';

var cpn = new component({
  el: 'application',
  data: {
    state: 'example'
  },
  render: function() {
    return (
      <div>
        Hello, I am a component :)
      </div>
    );
  }
});