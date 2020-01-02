const $ = require('jquery');
const rollDatabase = require('armorRollDatabase.js').armorRollDB;
const Utility = require('armorRoll.js').Utility;

const ARMOR_BUCKETS = [
  'bucket-3448274439', // Helm
  'bucket-3551918588', // Gloves
  'bucket-14239492',   // Chest
  'bucket-20886954',   // Legs
  'bucket-1585787867', // Class
]

function storeArmorData() {
  ARMOR_BUCKETS.forEach(function(className) {
    $('.'+className).find('.item').not('[data-fate-armor-registered]').each(function() {
      $(this).attr('data-fate-armor-registered', false);

      const armorName = $(this).attr('title').split("\n")[0];
      $(this).attr('data-fate-armor-name', armorName);
      
      // Is it an exotic or legendary masterwork?
      const isMasterwork = ($(this).has('._2kz8P').length + $(this).has('._3iMN1').length) > 0;
      $(this).attr('data-fate-masterwork', isMasterwork);

      const serialNumber = $(this).attr('id').split("-")[0];
      $(this).attr('data-fate-serial', serialNumber);

      const light = $(this).find('.AtD93').children('span').text();
      $(this).attr('data-fate-light', light);
    });
  });
}

function updateAttributes() {
  $('[data-fate-armor-registered]').each(function(index,element) {
    const serialNumber = $(this).attr('data-fate-serial');

    const isArmorRegistered = rollDatabase.contains(serialNumber);
    $(this).attr('data-fate-armor-registered', isArmorRegistered);
    
    const light = $(this).find('.AtD93').children('span').text();
    $(this).attr('data-fate-light', light);

    if (!isArmorRegistered) {
      $(this).removeAttr('data-fate-comment');
      $(this).removeAttr('data-fate-armor-junk');
      $(this).removeAttr('data-fate-armor-pve');
      $(this).removeAttr('data-fate-armor-pvp');
      return;
    }

    const a = rollDatabase.get(serialNumber);
    $(this).attr('data-fate-comment', a.comments);
    $(this).attr('data-fate-armor-junk', a.pveUtility === Utility.NO && a.pvpUtility === Utility.NO);
    $(this).attr('data-fate-armor-pve', a.pveUtility === Utility.YES);
    $(this).attr('data-fate-armor-pvp', a.pvpUtility === Utility.YES);
  });
}

fateBus.subscribe(module, 'fate.refresh', function() {
  storeArmorData();
  updateAttributes();
});
