var Promise = require('es6-promise')
      .Promise;
var _ = require('underscore');
var keystone = require('keystone');
var Page = keystone.list('Page');
var HomePage = keystone.list('HomePage');

function getInsertedId(saveOp) {
  return saveOp.emitted.complete[0]._id;
}
var homeId, l1Id, l2aId, l2bId, l3Id;

function insertTestPages(done) {
  /*
    * create a 3-level hierarcy:
    * home
    *   '-> level1
    *       '-> level2a
    *           '-> level3
    *       '-> level2b
    */
  new HomePage.model({
    title: 'home'
  }).save(function(err) {
    if (err)
      done(err);
    homeId = getInsertedId(this);
    new Page.model({
      title: 'level1',
      parent: homeId
    }).save(function(err) {
      if (err)
        done(err);
      l1Id = getInsertedId(this);
      new Page.model({
        title: 'level2a',
        parent: l1Id
      }).save(function(err) {
        if (err)
          done(err);
        l2aId = getInsertedId(this);
        new Page.model({
          title: 'level3',
          parent: l2aId
        }).save(function(err) {
          if (err)
            done(err);
          l3Id = getInsertedId(this);
          new Page.model({
            title: 'level2b',
            parent: l1Id
          }).save(function(err) {
            if (err)
              done(err);
            l2bId = getInsertedId(this);
            done();
          });
        });
      });
    });
  });
}

describe('For Pages', function() {
  beforeEach(function(done) {
    keystone.list('NavNode').model.find().remove(function(err) {
      if (err)
        done(err);
      insertTestPages(done);
    });
  });

  describe('when getting descendants', function() {
    var descendents;

    beforeEach(function(done) {
      Page.model.findOne(homeId).exec(function(err, page) {
        if (err) {
          done(err);
          return;
        }
        descendents = page.getAllDescendentNodes();
        done();
      });
    });

    it('should get correct number', function() {
      return expect(descendents).to.eventually.have.lengthOf(4);
    });

    it('should get correct items', function() {
      return expect(descendents).to.eventually.satisfy(function(ds) {
        return _.find(ds, function(d) { return d._id === l1Id; }) &&
          _.find(ds, function(d) { return d._id === l2aId; }) &&
          _.find(ds, function(d) { return d._id === l2bId; }) &&
          _.find(ds, function(d) { return d._id === l3Id; });
      });
    });
  });

  describe('when a Page is saved', function() {

    function loadPageThenEditAndSave(pageId, editCb) {
      return new Promise(function (resolve, reject) {
        Page.model.findOne({_id: pageId}).exec(function(err, page) {
          if (err) {
            reject(err);
            return;
          }
          editCb(page);
          page.save(function(err) {
            if (err) {
              reject(err);
              return;
            }
            resolve(true);
          });
        });
      });
    }

    it('should fail when self selected as parent', function() {
      return expect(loadPageThenEditAndSave(l2bId, function(page) {
        page.parent = page._id;
      })).to.be.rejectedWith(/cannot select an item as its own menu parent/);
    });

    it('should fail when a descendant selected as parent', function() {
      return expect(loadPageThenEditAndSave(l1Id, function(page) {
        page.parent = l3Id;
      })).to.be.rejectedWith(/cannot select a child\/descendent item as menu parent/);
    });
  });
});
