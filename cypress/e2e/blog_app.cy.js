describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('login form is shown', function() {
    cy.contains('log in').click()
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('input:first').type('user1')
      cy.get('input:last').type('test')
      cy.get('#login-button').click()

      cy.contains('user1 is logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('log in').click()
      cy.get('input:first').type('user1')
      cy.get('input:last').type('123')
      cy.get('#login-button').click()

      cy.contains('Wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'user1', password: 'test' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('input[placeholder="title"]').type('TEST')
      cy.get('input[placeholder="author"]').type('cypress')
      cy.get('input[placeholder="url"]').type('https://www.cypress.io/')
      cy.get('#create-blog-button').click()

      cy.contains('A new blog TEST by cypress added')
      cy.visit('http://localhost:3000')
    })
    describe('when blog exists', function () {
      beforeEach(function () {
        cy.createBlog({ title:'TEST',author:'cypress',url:'https://www.cypress.io/' })
      })

      it('User can like a blog', function() {
        cy.contains('view').click()
        cy.contains('like').click()
        cy.contains('1')

      })
      it('User who created a blog can delete it.', function() {
        cy.contains('view').click()
        cy.contains('remove').click()
        cy.get('#blog-list').should('not.contain', 'TEST cypress')
      })
    })

    describe('when few blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({ title:'TEST1',author:'cypress',url:'https://www.cypress.io/1' })
        cy.createBlog({ title:'TEST2',author:'cypress',url:'https://www.cypress.io/2' })
        cy.createBlog({ title:'TEST3',author:'cypress',url:'https://www.cypress.io/3' })
      })

      it('The blogs are ordered according to likes with the blog with the most likes being first', function() {
        cy.visit('http://localhost:3000')
        cy.contains('TEST2').contains('view').click()
        cy.contains('like').click()
        cy.contains('like').click()
        cy.contains('TEST2').contains('hide').click()
        cy.contains('TEST3').contains('view').click()
        cy.contains('like').click()
        cy.contains('like').click()
        cy.contains('like').click()
        cy.contains('TEST3').contains('hide').click()
        cy.visit('http://localhost:3000')
        cy.get('.blog').eq(0).should('contain', 'TEST3')
        cy.get('.blog').eq(1).should('contain', 'TEST2')
        cy.get('.blog').eq(2).should('contain', 'TEST1')
      })
    })

  })
})