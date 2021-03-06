import React, { useEffect, useState } from 'react';
import { TABLE_ROW_HEIGHT_IN_PX } from '../../Constant/SizeConstant';
import { Streamer } from '../../_Models/Streamer';
import { ItemDisplayText, ItemImage, ItemRankingScore, OrderDisplay, TableRow } from './LiveUpdateRankingTable.style';

const timeToFinishScoreUpdateInMs = 300;
const intervalTimeToUpdateInMs = 5;
function getIncreasingStep(scoreDiff: number): number {
    const step = Math.floor(scoreDiff / timeToFinishScoreUpdateInMs);
    return step === 0? 1: step;
}
const RankingTableRow: React.FC<{ item: Streamer, order: number }> = ({
    order, item
}) => {
    const [displayScore, setDisplayScore] = useState(item.score);
    useEffect(() => {
        const scoreDiff = item.score - displayScore;
        if(scoreDiff === 0) { return; }
        const increasingStep = getIncreasingStep(scoreDiff);
        let numberOfUpdatingInterval = 0;
        const maxUpdatingIntervalCount = timeToFinishScoreUpdateInMs / intervalTimeToUpdateInMs - 1;
        const updatingNumberInterval = setInterval(() => {
            setDisplayScore(d => d + increasingStep);
            numberOfUpdatingInterval++;
            if (numberOfUpdatingInterval === maxUpdatingIntervalCount) {
                clearInterval(updatingNumberInterval)
                setDisplayScore(item.score);
            }
        }, intervalTimeToUpdateInMs);
        return () => {
            setDisplayScore(item.score);
            clearInterval(updatingNumberInterval);
        }
    }, [item]);
    return <TableRow order={order}>
        <OrderDisplay order={order}>{order + 1}</OrderDisplay>
        <ItemImage></ItemImage>
        <ItemDisplayText>{item.displayName}</ItemDisplayText>
        <ItemRankingScore>{displayScore}pt</ItemRankingScore>
    </TableRow>
}

export default RankingTableRow;