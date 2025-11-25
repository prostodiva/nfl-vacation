// // hooks/useSouvenirEdit.ts
// import { useUpdateSouvenirMutation } from '../store/apis/souvenirsApi';
// import { souvenirFields } from '../config/formFields';
// import type { SouvenirItem } from '../store/types/teamTypes';
// import { useEntityEdit } from './useEntityEdit';

// export function useSouvenirEdit() {
//   return useEntityEdit<SouvenirItem, any>({
//     fields: souvenirFields,
//     updateMutation: useUpdateSouvenirMutation,
//     transformData: (data) => ({
//       souvenir: {
//         name: data.name,
//         price: data.price,
//         category: data.category,
//         isTraditional: data.isTraditional
//       }
//     })
//   });
// }