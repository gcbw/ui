import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { set } from '@ember/object';

const mockPipeline = EmberObject.create({
  id: 1,
});

module('Integration | Component | pipeline list history cell', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.setProperties({
      pipeline: mockPipeline,
    });
  });

  test('it renders', async function(assert) {
    set(this, 'value', [
      {
        id: 1,
        status: 'RUNNING'
      },
      {
        id: 2,
        status: 'RUNNING'
      }
    ]);

    await render(hbs`{{pipeline-list-history-cell
      value=value
    }}`);

    assert.dom('a').hasAttribute(
      'href',
      `/pipelines/${mockPipeline.id}/builds/${this.value[1].id}`
    );
    assert.dom('.fa-circle').hasClass('SUCCESS');
    assert.dom('.fa-circle').exists({ count: 1 });
  });

  test('it renders empty', async function(assert) {
    set(this, 'value', [
      {
        id: 1,
        status: 'RUNNING'
      }
    ]);

    await render(hbs`{{pipeline-list-history-cell
      value=value
    }}`);

    assert.dom('a').doesNotExist();
    assert.dom('.fa-circle').doesNotExist();
  });

  test('it renders aborted build', async function(assert) {
    set(this, 'value', [
      {
        id: 1,
        status: 'RUNNING'
      },
      {
        id: 2,
        status: 'ABORTED'
      }
    ]);

    await render(hbs`{{pipeline-list-history-cell
      value=value
    }}`);

    assert.dom('a').hasAttribute(
      'href',
      `/pipelines/${mockPipeline.id}/builds/${this.value[1].id}`
    );
    assert.dom('.fa-circle').hasClass('ABORTED');
    assert.dom('.fa-circle').exists({ count: 1 });
  });
});
