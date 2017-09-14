import Ember from 'ember';

/**
 * Inject session service to an Ember Object
 * @param {Object} self - Ember object generated by ember-qunit moduleFor()
 */
export default function injectSessionStub(self) {
  const sessionStub = Ember.Object.extend({
    isAuthenticated() {
      return true;
    }
  });

  self.register('service:session', sessionStub);
  self.inject.service('session');
}