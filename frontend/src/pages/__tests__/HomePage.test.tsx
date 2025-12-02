import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { store } from '../../store/index';
import HomePage from '../HomePage';

describe('HomePage', () => {
    it('shows hero section', () => {
        render(
            <Provider store={store}>
                <BrowserRouter> 
                    <HomePage />
                </BrowserRouter>
            </Provider>
        );
        const heroElement = screen.getByTestId("hero");
        expect(heroElement).toBeInTheDocument();
    })
})
