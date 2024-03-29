import bag from '../models/bag'
import items from '../models/item'

const calculateWornItemsTotalWeight = async (bagId, userId) => {
    try {
      const wornItemsInBag = await items.find({creator: userId, bagId, worn: true });
  
      let totalWeight = 0;
  
      wornItemsInBag.forEach((item) => {
        let weightInGrams = item.weight;
  
        switch (item.wgtOpt) {
          case "kg":
            weightInGrams *= 1000;
            break;
          case "lb":
            weightInGrams *= 453.592;
            break;
          case "oz":
            weightInGrams *= 28.3495;
            break;
          default:
            break;
        }
  
        totalWeight += weightInGrams * item.qty;
      });
  
      const Bag = await bag.findById(bagId);
  
      if (!Bag || Bag.creator.toString() !== userId.toString()) {
        throw { status: 404, message: "Bag not found" };
      }
  
      return { totalWeight: totalWeight / 1000 };
    } catch (error) {
      console.error("Error calculating total weight of worn items based on wgtOpt:", error);
      throw { status: 500, message: "Internal Server Error" };
    }
  };


  module.exports = { calculateWornItemsTotalWeight }