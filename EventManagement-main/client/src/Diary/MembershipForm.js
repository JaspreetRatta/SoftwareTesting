// MembershipForm.js
import React from 'react';
import { Modal, Button } from 'antd';

const MembershipForm = ({ visible, onClose, onSubscribe }) => {

  const handleSubscribe = () => {
    // Here, you would typically handle the subscription logic, like processing payment.
    // After successful subscription, call onSubscribe.
    onSubscribe();
  };

  return (
    <Modal
      title="Membership Subscription"
      visible={visible}
      footer={null}
      onCancel={onClose}
    >
      <div>
        <h3>Basic Membership</h3>
        <p>Get access to add memories for 200 THB!</p>
        <Button type="primary" onClick={handleSubscribe}>Subscribe for 200 THB</Button>
      </div>
    </Modal>
  );
};

export default MembershipForm;
