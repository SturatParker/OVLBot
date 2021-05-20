require("dotenv").config();
const { getVotedItems } = require("../db/db");
const threshHoldMatches = process.env.SUSPICIOUS_VOTES_THRESHOLD;
const getSuspiciousPeers = (memberId) => {
  // return empty array if a threshhold value has not been set
  if (!threshHoldMatches) {
    return Promise.resolve([]);
  }

  // get member's voted items
  return getVotedItems(memberId).then((assessedMemberItems) => {
    // return if member has voted for fewer than the threshhold
    if (assessedMemberItems.length < threshHoldMatches) {
      return Promise.resolve([]);
    }

    // get ids of peers who voted for any of these items
    const peerIdSet = new Set(
      assessedMemberItems.map((item) => item.voterIds).flat()
    );
    peerIdSet.delete(memberId);
    const peerIds = [...peerIdSet];
    return Promise.all(peerIds.map((peerId) => getVotedItems(peerId))).then(
      (peerItems) => {
        // find ids of peers what are suspicious
        const assessedMemberItemIds = assessedMemberItems.map(
          (item) => item.messageId
        );
        const peerList = peerIds.map((peerId, index) => ({
          id: peerId,
          items: peerItems[index],
        }));
        const similarPeerIds = peerList.filter((peer) => {
          peerItemIds = peer.items.map((item) => item.messageId);
          const matches = peerItemIds.filter((id) =>
            assessedMemberItemIds.includes(id)
          );
          return matches.length >= threshHoldMatches;
        });
        //   .map((peer) => peer.id);
        return similarPeerIds;
      }
    );
  });
};

module.exports = {
  getSuspiciousPeers,
};
