import React from 'react';

import styles from './contact.less';
class ContactUs extends React.PureComponent {
    static loadData = () => {

    };
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className={styles['contact-container']}>
                同构项目联系我们
            </div>
        );
    }
};

export default ContactUs;