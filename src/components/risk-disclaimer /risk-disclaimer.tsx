import React, { useState } from 'react';
import Button from '@/components/shared_ui/button';
import Modal from '@/components/shared_ui/modal';
import Text from '@/components/shared_ui/text';
import { localize } from '@deriv-com/translations';
import './risk-disclaimer.scss';

const RiskDisclaimer = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUnderstand = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {/* Floating Risk Disclaimer Button */}
            <div className='risk-disclaimer-button'>
                <Button className='risk-disclaimer-button__btn' onClick={handleOpenModal} secondary small>
                    {localize('Risk Disclaimer')}
                </Button>
            </div>

            {/* Risk Disclaimer Modal */}
            <Modal
                is_open={isModalOpen}
                title={localize('Risk Disclaimer')}
                onClose={handleCloseModal}
                width='500px'
                className='risk-disclaimer-modal'
            >
                <div className='risk-disclaimer-modal__content'>
                    <Text size='s' color='prominent' weight='bold' className='risk-disclaimer-modal__title'>
                        {localize('Important Risk Warning')}
                    </Text>

                    <Text size='xs' color='general' className='risk-disclaimer-modal__text'>
                        {localize(
                            'Deriv offers complex derivatives, such as options and contracts for difference ("CFDs"). These products may not be suitable for all clients, and trading them puts you at risk. Please make sure that you understand the following risks before trading Deriv products: a) you may lose some or all of the money you invest in the trade, b) if your trade involves currency conversion, exchange rates will affect your profit and loss. You should never trade with borrowed money or with money that you cannot afford to lose.'
                        )}
                    </Text>

                    <div className='risk-disclaimer-modal__actions'>
                        <Button className='risk-disclaimer-modal__understand-btn' onClick={handleUnderstand} primary>
                            {localize('I Understand')}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default RiskDisclaimer;
