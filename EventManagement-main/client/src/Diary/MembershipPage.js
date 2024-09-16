import React from 'react';
import { Modal, Button } from 'antd';

const MembershipModal = ({ visible, onClose, onMembershipSelect }) => {
  const handleSubscribe = () => {
    // Here you would typically integrate with the payment gateway.
    // After successful payment, you would call onMembershipSelect with the Basic plan.
    onMembershipSelect("Basic");
  };

  return (
    <Modal
      title="Membership Plan"
      visible={visible}
      footer={null}
      onCancel={onClose}
    >
      <div>
        <h3>Basic Plan</h3>
        <p>Join our Basic Plan for 200 THB!</p>
        <Button type="primary" onClick={handleSubscribe}>Subscribe for 200 THB</Button>
      </div>
    </Modal>
  );
};

export default MembershipModal;

