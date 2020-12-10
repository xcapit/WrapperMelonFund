import React from 'react';
import {
  RadioButtonContainer,
  RadioButtonInput,
  RadioButtonMask,
  RadioButtonIcon,
  RadioButtonLabel,
} from './RadioButton';

export default { title: 'Atoms|RadioButton' };

export const Default: React.FC = () => {
  return (
    <RadioButtonContainer>
      <RadioButtonInput type="radio" id="idradio" name="my_RadioButton" value="1" />
      <RadioButtonMask>
        <RadioButtonIcon />
      </RadioButtonMask>
      <RadioButtonLabel htmlFor="idradio">I'm a label</RadioButtonLabel>
    </RadioButtonContainer>
  );
};

export const Disabled: React.FC = () => {
  return (
    <RadioButtonContainer>
      <RadioButtonInput type="radio" id="idradio" name="my_RadioButton" value="1" disabled={true} />
      <RadioButtonMask>
        <RadioButtonIcon />
      </RadioButtonMask>
      <RadioButtonLabel htmlFor="idradio">I'm a label</RadioButtonLabel>
    </RadioButtonContainer>
  );
};

export const DisabledChecked: React.FC = () => {
  return (
    <RadioButtonContainer>
      <RadioButtonInput type="radio" id="idradio" name="my_RadioButton" value="1" disabled={true} checked={true} />
      <RadioButtonMask>
        <RadioButtonIcon />
      </RadioButtonMask>
      <RadioButtonLabel htmlFor="idradio">I'm a label</RadioButtonLabel>
    </RadioButtonContainer>
  );
};
