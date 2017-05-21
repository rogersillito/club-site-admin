var Promise = require('es6-promise')
      .Promise;
var _ = require('underscore');
var keystone = require('keystone');
var Page = keystone.list('Page');
var MenuLink = keystone.list('MenuLink');
var HomePage = keystone.list('HomePage');

function getInsertedId(saveOp) {
  return saveOp.emitted.complete[0]._id;
}
var homeId, l1Id, l2aId, l2bId, l3Id, l3cId, l3xId, l3bSysPageId, l3dId, l4Id;

function insertTestPages(done) {
  /*
    * create a 3-level hierarcy:
    * home
    *   '-> level1
    *       '-> level2b
    *           '-> level3x
    *           '-> level3-SysPage
    *           '-> level3c
    *           '-> level3d
    *               '-> level4
    *       '-> level2a
    *           '-> level3
    */
  new HomePage.model({
    title: 'home',
    bannerImage: { public_id: true }
  }).save(function(err) {
    if (err)
      done(err);
    homeId = getInsertedId(this);
    new Page.model({
      title: 'level1',
      isPublished: true,
      parent: homeId
    }).save(function(err) {
      if (err)
        done(err);
      l1Id = getInsertedId(this);
      new Page.model({
        title: 'level2a',
        isPublished: true,
        parent: l1Id
      }).save(function(err) {
        if (err)
          done(err);
        l2aId = getInsertedId(this);
        new Page.model({
          title: 'level3',
          isPublished: true,
          parent: l2aId
        }).save(function(err) {
          if (err)
            done(err);
          l3Id = getInsertedId(this);
          new Page.model({
            title: 'level2b',
            isPublished: true,
            parent: l1Id
          }).save(function(err) {
            if (err)
              done(err);
            l2bId = getInsertedId(this);
            new MenuLink.model({
              title: 'level3-SysPage',
              isPublished: true,
              navOrder: 3, // ordered!
              relativeUrl: '/should/use/relativeUrl/instead/of/routePath',
              parent: l2bId
            }).save(function(err) {
              if (err)
                done(err);
              l3bSysPageId = getInsertedId(this);
              new Page.model({
                title: 'level3x',
                isPublished: true,
                navOrder: 1, // ordered!
                parent: l2bId
              }).save(function(err) {
                if (err)
                  done(err);
                l3xId = getInsertedId(this);
                new Page.model({
                  title: 'level3c',
                  isPublished: true,
                  navOrder: 2, // ordered!
                  parent: l2bId
                }).save(function(err) {
                  if (err)
                    done(err);
                  l3cId = getInsertedId(this);
                  new Page.model({
                    title: 'level3d',
                    isPublished: false, // unpublished!
                    parent: l2bId
                  }).save(function(err) {
                    if (err)
                      done(err);
                    l3dId = getInsertedId(this);
                    new Page.model({
                      title: 'level4',
                      isPublished: true,
                      parent: l3dId
                    }).save(function(err) {
                      if (err)
                        done(err);
                      l4Id = getInsertedId(this);
                      done();
                    });
                  });
                });
              });
            });
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

  function deleteNode(id) {
    var promise = Page.model.findById(id).exec();
    return promise.then(function(node) {
      return node.remove();
    });
  }

  describe('when deleting a leaf node', function() {
    
    it('should succeed', function() {
      return expect(deleteNode(l3Id)).to.be.fulfilled;
    });

    it('should update menu html without removed node', function() {
      var waitSeconds = 60;
      var promiseWithAddedWait = deleteNode(l3Id).then(function() {
        return new Promise(function (resolve) {
          setTimeout(function() { resolve(); }, waitSeconds);
        });
      });

      return expect(promiseWithAddedWait).to.eventually.satisfy(function() {
        var expected = '<li><a href="/pages/">home</a></li>\n\
   <li><a href="/pages/level1">level1<span class="caret"></span></a>\n\
    <ul class="dropdown-menu">\n\
     <li><a href="/pages/level1/level2a">level2a</a>\n\
     </li>\n\
     <li><a href="/pages/level1/level2b">level2b<span class="caret"></span></a>\n\
      <ul class="dropdown-menu">\n\
       <li><a href="/pages/level1/level2b/level3x">level3x</a>\n\
       </li>\n\
       <li><a href="/pages/level1/level2b/level3c">level3c</a>\n\
       </li>\n\
       <li><a href="/should/use/relativeUrl/instead/of/routePath">level3-SysPage</a>\n\
       </li>\n\
      </ul>\n\
     </li>\n\
    </ul>\n\
   </li>\n\n';
        var html = keystone.get('navigation').menu;
        var satisfies = html === expected;
        if (!satisfies) {
          console.log("navigtion html = ", html);
          console.log("expected html = ", expected);
        }
        return satisfies;
      });
    });
  });

  describe('when deleting a node with children', function() {
    // TODO: re-enable when bug fixed https://github.com/keystonejs/keystone/issues/536 
    // currently the pre remove hook works, but the test fails and in the UI no error is visible when an item with children is deleted (the non-deleted item re-appears on refresh)
    xit('should fail', function() {
      return expect(deleteNode(l2bId)).to.be.rejectedWith(/cannot delete an item that has child items/);
    });
  });

  describe('when getting nodes to root', function() {
    var nodesToRoot;

    beforeEach(function(done) {
      Page.model.findOne(l3Id).exec(function(err, page) {
        if (err) {
          done(err);
          return;
        }
        nodesToRoot = page.getNodesToRoot();
        done();
      });
    });

    it('should get nodes in correct order', function() {
      return expect(nodesToRoot).to.eventually.satisfy(function(ns) {
        function idxEq(idx, id) {
          return ns[idx]._id.equals(id);
        }
        return idxEq(0,l3Id) && idxEq(1,l2aId) && idxEq(2,l1Id) && idxEq(3,homeId);
      });
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
      return expect(descendents).to.eventually.have.lengthOf(9);
    });

    it('should get all descendent items', function() {
      function isIn(id, ds) {
        return _.find(ds, function(d) { return d._id.equals(id); });
      }
      return expect(descendents).to.eventually.satisfy(function(ds) {
        return isIn(l1Id, ds) &&
               isIn(l2aId, ds) &&
               isIn(l2bId, ds) &&
               isIn(l3cId, ds) &&
               isIn(l3xId, ds) &&
               isIn(l3dId, ds) &&
               isIn(l4Id, ds) &&
               isIn(l3Id, ds);
      });
    });
  });

  describe('when a Page is saved', function() {

    function editAndSave(pageId, editCb, ksList) {
      ksList = ksList || Page;
      return new Promise(function (resolve, reject) {
        ksList.model.findOne({_id: pageId}).exec(function(err, page) {
          if (err) {
            reject(err);
            return;
          }
          editCb(page);
          if (!page.isModified()) {
            resolve(page);
          }
          page.save(function(err) {
            if (err) {
              reject(err);
              return;
            }
            resolve(page);
          });
        });
      });
    }

    function editAndSaveThenWaitBeforeGettingChildren(pageId, editCb, waitSeconds)
    {
      waitSeconds = waitSeconds || 25;
      // if we need to look at changes that have been triggered on descendents
      // we need to wait for those saves to take place.
      // Adding a small wait after the save, before getting the children
      // is the best/only solution I can think of...
      return editAndSave(pageId, editCb)
        .then(function(page) {
          return new Promise(function (resolve, reject) {
            function doTimed() {
              page.getAllDescendentNodes()
                .then(function(nodes) {
                  resolve(nodes);
                }).catch(resolve);
            }
            setTimeout(doTimed, waitSeconds);
          });
        });
    }

    it('should set routePath with updated valid parent', function() {
      return expect(editAndSave(l3Id, function(page) {
        page.parent = l2bId;
      })).to.eventually.satisfy(function(page) {
        return page.routePath === '/level1/level2b/level3';
      });
    });

    it('should set level', function() {
      return expect(editAndSave(l3Id, function(page) {
        page.parent = l2bId;
      })).to.eventually.satisfy(function(page) {
        return page.level === 3;
      });
    });

    it('should succeed with updated valid parent', function() {
      return expect(editAndSave(l3Id, function(page) {
        page.parent = homeId;
      })).to.be.fulfilled;
    });

    it('should fail when self selected as parent', function() {
      return expect(editAndSave(l2bId, function(page) {
        page.parent = page._id;
      })).to.be.rejectedWith(/cannot select an item as its own menu parent/);
    });

    it('should fail when no parent', function() {
      return expect(editAndSave(l2bId, function(page) {
        page.parent = undefined;
      })).to.be.rejectedWith(/must select a menu parent/);
    });

    it('should fail when a descendant selected as parent', function() {
      return expect(editAndSave(l1Id, function(page) {
        page.parent = l3Id;
      })).to.be.rejectedWith(/cannot select a child\/descendent item as menu parent/);
    });

    it('should fail when MenuLink selected as parent', function() {
      return expect(editAndSave(l3Id, function(page) {
        page.parent = l3bSysPageId;
      })).to.be.rejectedWith(/You cannot select an item of this type to be a menu parent/);
    });

    it('descendents should also become unpublished if unpublished', function() {
      return expect(editAndSaveThenWaitBeforeGettingChildren(l1Id, function(page) {
        page.isPublished = false;
        // nb: the wait time is critical for this test!
      }, 130)).to.eventually.satisfy(function(ds) {
        return _.every(ds, function(d) {
          // console.log("d = ", d);
          return !d.isPublished; });
      });
    });

    it('descendents should have routePath updated to reflect a change in slug', function() {
      return expect(editAndSaveThenWaitBeforeGettingChildren(l1Id, function(page) {
        page.title = 'something';
      }, 60)).to.eventually.satisfy(function(ds) {
        function routePathEquals(id, expected) {
          var navNode = _.find(ds, function(d) { return d._id.equals(id); });
          var assert = navNode.routePath === expected;
          if (!assert)
            console.log("navNode.routePath = ", navNode.routePath);
          return assert;
        }
        return routePathEquals(l2aId, '/something/level2a') &&
               routePathEquals(l2bId, '/something/level2b') &&
               routePathEquals(l3Id,  '/something/level2a/level3');
      });
    });

    it('should update menu html - respecting ordering and isPublished', function() {
      return expect(editAndSaveThenWaitBeforeGettingChildren(l1Id, function(page) {
        page.title = 'something else';
      }, 60)).to.eventually.satisfy(function() {
        var expected = '<li><a href="/pages/">home</a></li>\n\
   <li><a href="/pages/something-else">something else<span class="caret"></span></a>\n\
    <ul class="dropdown-menu">\n\
     <li><a href="/pages/something-else/level2a">level2a<span class="caret"></span></a>\n\
      <ul class="dropdown-menu">\n\
       <li><a href="/pages/something-else/level2a/level3">level3</a>\n\
       </li>\n\
      </ul>\n\
     </li>\n\
     <li><a href="/pages/something-else/level2b">level2b<span class="caret"></span></a>\n\
      <ul class="dropdown-menu">\n\
       <li><a href="/pages/something-else/level2b/level3x">level3x</a>\n\
       </li>\n\
       <li><a href="/pages/something-else/level2b/level3c">level3c</a>\n\
       </li>\n\
       <li><a href="/should/use/relativeUrl/instead/of/routePath">level3-SysPage</a>\n\
       </li>\n\
      </ul>\n\
     </li>\n\
    </ul>\n\
   </li>\n\n';
        var html = keystone.get('navigation').menu;
        var satisfies = html === expected;
        if (!satisfies) {
          console.log("navigtion html = ", html);
          console.log("expected html = ", expected);
        }
        return satisfies;
      });
    });
  });
});
