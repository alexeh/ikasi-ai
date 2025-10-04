import { render, screen } from '@testing-library/react';
import Page from '@/app/page';

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Page />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
