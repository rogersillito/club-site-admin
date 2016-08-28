var Promise = require('es6-promise')
      .Promise;
var _ = require('underscore');
var keystone = require('keystone');
var Page = keystone.list('Page');
var HomePage = keystone.list('HomePage');
// var testName = '-MOCHA-TEST-ITEM';
// function getTestName(name) {
//   return name + testName;
// }

describe('when a Page is saved', function() {
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

  beforeEach(function(done) {
    keystone.list('NavNode').model.find().remove(function(err) {
      if (err)
        done(err);
      insertTestPages(done);
    });
  });

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
});

