
// Lib
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend( advancedFormat );
dayjs.extend( weekOfYear );

import imageVar from '@/utils/imageVar';

// Lib Components
import QRCode from 'react-qr-code';

// Styles
import styles from '@/styles/components/Ticket.module.scss';

export default function Ticket({ id, queue, timeslot }){

    const date = timeslot ? dayjs.unix( timeslot.startTime ) : dayjs();
    const dateStr = date.format('dddd, wo MMM');

    const estWaitTime = queue.waitTimes.find( wt => wt.name=='Virtual' );

    const timeslotStr = timeslot
    ? `${dayjs.unix( timeslot.startTime ).format('HH:mm')} - ${dayjs.unix( timeslot.startTime + timeslot.duration ).format('hh:mm')}`
    : estWaitTime ? `est. ${estWaitTime.minutes} minutes`
    : null;

    // TODO: Replace with JWT
    const QRValue = `${queue.id}:${id}`

    return (
        <div className={styles.ticket} style={imageVar( queue.bannerImage )}>
            <h2>{ queue.name }</h2>
            <p>{ dateStr }</p>
            { timeslotStr && <p className={styles.timeslot}>{ timeslotStr }</p> }
            <div className={styles.QRContainer}>
                <QRCode value={QRValue} style={{ width: '100%', height: 'auto' }}/>
            </div>
        </div>
    )
}