import { CompanyBookPage } from './app.po';

describe('company-book App', () => {
  let page: CompanyBookPage;

  beforeEach(() => {
    page = new CompanyBookPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to cb!!');
  });
});
