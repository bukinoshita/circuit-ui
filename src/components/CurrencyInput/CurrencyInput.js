import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'emotion-theming';

import { SimpleCurrencyInput } from './components';
import { keys } from '../../util/fp';
import { themePropType, localePropType } from '../../util/shared-prop-types';
import { shouldPrependSymbol, CURRENCY_SYMBOLS } from '../../util/currency';

/**
 * CurrencyInput component for forms. Automatically looks up
 * symbols and places the symbol according to the locale. The corresponding
 * service exports a parser for formatting values automatically.
 */

const CurrencyInput = ({ locale, currency, ...props }) => {
  const prependSymbol = shouldPrependSymbol(currency, locale);
  const symbol = CURRENCY_SYMBOLS[currency] || '';

  return <SimpleCurrencyInput {...{ ...props, prependSymbol, symbol }} />;
};

CurrencyInput.propTypes = {
  theme: themePropType.isRequired,
  locale: localePropType.isRequired,
  currency: PropTypes.oneOf(keys(CURRENCY_SYMBOLS)).isRequired
};

/**
 * @component
 */
export default withTheme(CurrencyInput);
