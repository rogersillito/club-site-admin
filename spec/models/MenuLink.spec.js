var Promise = require('es6-promise')
      .Promise;
var _ = require('underscore');
var keystone = require('keystone');
var HomePage = keystone.list('HomePage');
var MenuLink = keystone.list('MenuLink');

var sut = require('../../lib/navigation.js');

var homeId, resultsId, galleryId, galleryUnpublishedId, postsId, newsId, recordsId;

function getInsertedId(saveOp) {
  return saveOp.emitted.complete[0]._id;
}

function insertTestNodes(done) {
  /*
   * create a 1-level hierarcy:
   * home
   *   '-> results
   *   '-> gallery
   *   '-> galleryUnpublished
   *   '-> posts
   *   '-> news
   *   '-> records
   */

  function newLink(title, url, isPublished, parentId) {
    return new Promise(function (resolve, reject) {
      new MenuLink.model({
        title: title,
        isPublished: isPublished,
        parent: parentId,
        relativeUrl: url
      }).save(function(err) {
        if (err) {
          reject(err);
        }
        var newId = getInsertedId(this);
        resolve(newId);
      });
    });
  }

  new HomePage.model({
    title: 'home',
    bannerImage: { public_id: true }
  }).save(function(err) {
    if (err)
      done(err);
    homeId = getInsertedId(this);

    var results = [];
    results.push(newLink('results', '/results', true, homeId));
    results.push(newLink('galleryUnpublished', '/galleries/test', false, homeId));
    results.push(newLink('gallery', '/galleries', true, homeId));
    results.push(newLink('posts', '/posts', true, homeId));
    results.push(newLink('news', '/posts/news', true, homeId));
    results.push(newLink('records', '/posts/records', true, homeId));
    
    Promise.all(results).then(function(rs) {
      resultsId = rs[0];
      galleryUnpublishedId = rs[1];
      galleryId = rs[2];
      newsId = rs[3];
      postsId = rs[4];
      recordsId = rs[5];
      done();
    }).catch(function(err) {
      done(err);
    });
  });
}

  describe('For MenuLinks searched by url', function() {
    beforeEach(function(done) {
      keystone.list('NavNode').model.find().remove(function(err) {
        if (err)
          done(err);
        insertTestNodes(done);
      });
    });
    
    it('should get exact match', function() {
      return expect(sut.getMenuLinkMatching('/results')).to.eventually.satisfy(function(result) {
        return result._id.equals(resultsId);
      });
    });
    
    it('should ignore unpublished', function() {
      return expect(sut.getMenuLinkMatching('/galleries/test')).to.eventually.satisfy(function(result) {
        return result._id.equals(galleryId);
      });
    });
    
    it('should match against longest matching relativeUrl', function() {
      return expect(sut.getMenuLinkMatching('/posts/records')).to.eventually.satisfy(function(result) {
        return result._id.equals(recordsId);
      });
    });
    
    it('should reject when no match', function() {
      return expect(sut.getMenuLinkMatching('/oh/no/way')).to.eventually.be.rejectedWith('No MenuLink matches: /oh/no/way');
    });
  });
