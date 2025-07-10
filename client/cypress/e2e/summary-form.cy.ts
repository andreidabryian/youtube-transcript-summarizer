describe('Summary Form E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the form correctly', () => {
    cy.get('[data-testid="summary-form"]').should('be.visible');
    cy.get('[data-testid="video-url-input"]').should('be.visible');
    cy.get('[data-testid="max-points-input"]').should('be.visible');
    cy.get('[data-testid="generate-summary-btn"]').should('be.visible');
  });

  it('should validate empty form submission', () => {
    cy.get('[data-testid="generate-summary-btn"]').click();
    cy.get('[data-testid="video-url-error"]').should('be.visible');
    cy.get('[data-testid="video-url-error"]').should('contain', 'URL видео обязателен');
  });

  it('should validate invalid YouTube URL', () => {
    cy.get('[data-testid="video-url-input"]').type('https://www.google.com');
    cy.get('[data-testid="generate-summary-btn"]').click();
    cy.get('[data-testid="video-url-error"]').should('be.visible');
    cy.get('[data-testid="video-url-error"]').should('contain', 'Пожалуйста, введите корректный URL YouTube видео');
  });

  it('should validate max points range', () => {
    cy.get('[data-testid="video-url-input"]').type('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    cy.get('[data-testid="max-points-input"]').clear().type('0');
    cy.get('[data-testid="generate-summary-btn"]').click();
    cy.get('[data-testid="max-points-error"]').should('be.visible');
    cy.get('[data-testid="max-points-error"]').should('contain', 'Количество пунктов должно быть от 1 до 20');

    cy.get('[data-testid="max-points-input"]').clear().type('25');
    cy.get('[data-testid="generate-summary-btn"]').click();
    cy.get('[data-testid="max-points-error"]').should('be.visible');
    cy.get('[data-testid="max-points-error"]').should('contain', 'Количество пунктов должно быть от 1 до 20');
  });

  it('should clear errors when valid input is provided', () => {
    // First, trigger an error
    cy.get('[data-testid="generate-summary-btn"]').click();
    cy.get('[data-testid="video-url-error"]').should('be.visible');

    // Then provide valid input
    cy.get('[data-testid="video-url-input"]').type('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    cy.get('[data-testid="video-url-error"]').should('not.exist');
  });

  it('should show loading state during API call', () => {
    cy.intercept('GET', '**/api/youtube/video-info*', {
      statusCode: 200,
      body: {
        id: 'test-id',
        title: 'Test Video',
        author: 'Test Author',
        duration: '00:10:30',
        description: 'Test description',
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
        uploadDate: '2024-01-01T00:00:00Z',
        viewCount: 1000
      },
      delay: 1000
    }).as('getVideoInfo');

    cy.get('[data-testid="video-url-input"]').type('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    cy.get('[data-testid="max-points-input"]').clear().type('5');
    cy.get('[data-testid="generate-summary-btn"]').click();

    cy.get('[data-testid="loading-spinner"]').should('be.visible');
    cy.wait('@getVideoInfo');
    cy.get('[data-testid="loading-spinner"]').should('not.exist');
  });

  it('should handle API errors gracefully', () => {
    cy.intercept('GET', '**/api/youtube/video-info*', {
      statusCode: 400,
      body: { message: 'Video not found' }
    }).as('getVideoInfoError');

    cy.get('[data-testid="video-url-input"]').type('https://www.youtube.com/watch?v=invalid-id');
    cy.get('[data-testid="max-points-input"]').clear().type('5');
    cy.get('[data-testid="generate-summary-btn"]').click();

    cy.wait('@getVideoInfoError');
    cy.get('[data-testid="error-message"]').should('be.visible');
    cy.get('[data-testid="error-message"]').should('contain', 'Ошибка');
  });

  it('should display video info after successful API call', () => {
    const mockVideoInfo = {
      id: 'test-id',
      title: 'Test Video Title',
      author: 'Test Author',
      duration: '00:10:30',
      description: 'Test description',
      thumbnailUrl: 'https://example.com/thumbnail.jpg',
      uploadDate: '2024-01-01T00:00:00Z',
      viewCount: 1000
    };

    cy.intercept('GET', '**/api/youtube/video-info*', {
      statusCode: 200,
      body: mockVideoInfo
    }).as('getVideoInfo');

    cy.get('[data-testid="video-url-input"]').type('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    cy.get('[data-testid="max-points-input"]').clear().type('5');
    cy.get('[data-testid="generate-summary-btn"]').click();

    cy.wait('@getVideoInfo');
    cy.get('[data-testid="video-info-card"]').should('be.visible');
    cy.get('[data-testid="video-title"]').should('contain', mockVideoInfo.title);
    cy.get('[data-testid="video-author"]').should('contain', mockVideoInfo.author);
    cy.get('[data-testid="video-duration"]').should('contain', mockVideoInfo.duration);
  });

  it('should display summary after successful generation', () => {
    const mockSummary = {
      videoInfo: {
        id: 'test-id',
        title: 'Test Video Title',
        author: 'Test Author',
        duration: '00:10:30',
        description: 'Test description',
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
        uploadDate: '2024-01-01T00:00:00Z',
        viewCount: 1000
      },
      summaryPoints: ['Point 1', 'Point 2', 'Point 3'],
      fullSummary: 'This is a test summary',
      generatedAt: '2024-01-01T00:00:00Z'
    };

    cy.intercept('GET', '**/api/youtube/video-info*', {
      statusCode: 200,
      body: mockSummary.videoInfo
    }).as('getVideoInfo');

    cy.intercept('POST', '**/api/youtube/summary*', {
      statusCode: 200,
      body: mockSummary
    }).as('generateSummary');

    cy.get('[data-testid="video-url-input"]').type('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    cy.get('[data-testid="max-points-input"]').clear().type('5');
    cy.get('[data-testid="generate-summary-btn"]').click();

    cy.wait('@getVideoInfo');
    cy.wait('@generateSummary');

    cy.get('[data-testid="summary-section"]').should('be.visible');
    cy.get('[data-testid="summary-points"]').should('be.visible');
    cy.get('[data-testid="full-summary"]').should('be.visible');
    cy.get('[data-testid="summary-points"] li').should('have.length', 3);
  });

  it('should reset form after successful submission', () => {
    cy.intercept('GET', '**/api/youtube/video-info*', {
      statusCode: 200,
      body: { id: 'test-id', title: 'Test Video' }
    }).as('getVideoInfo');

    cy.intercept('POST', '**/api/youtube/summary*', {
      statusCode: 200,
      body: { videoInfo: { id: 'test-id', title: 'Test Video' }, summaryPoints: [], fullSummary: 'Test' }
    }).as('generateSummary');

    cy.get('[data-testid="video-url-input"]').type('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    cy.get('[data-testid="max-points-input"]').clear().type('5');
    cy.get('[data-testid="generate-summary-btn"]').click();

    cy.wait('@getVideoInfo');
    cy.wait('@generateSummary');

    // Form should be reset
    cy.get('[data-testid="video-url-input"]').should('have.value', '');
    cy.get('[data-testid="max-points-input"]').should('have.value', '5'); // Default value
  });
}); 