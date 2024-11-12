import { db, firestore } from 'config/firebase.init'

// Firestore imports
import {
  doc,
  setDoc,
  getDocs,
  updateDoc,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
} from 'firebase/firestore'
import firebase from 'firebase/app'
import 'firebase/firestore'

export const loadStorage = key => {
  try {
    const serializedState = localStorage.getItem(key)
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

export const handleMakeReferance = name => {
  const currentDate = new Date()
  // const year = currentDate.getFullYear().toString().substr(-2)
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
  const day = currentDate.getDate().toString().padStart(2, '0')
  // const hour = currentDate.getHours().toString().padStart(2, '0')
  const minute = currentDate.getMinutes().toString().padStart(2, '0')
  const formattedDate = day + month + minute

  const userNameWords = name.split(' ')

  const userInitials = `${userNameWords[0]}-`.toUpperCase()

  const uniqueId = userInitials + formattedDate

  return uniqueId
}

export const addUser = async data => {
  try {
    await setDoc(doc(db, 'user', data.myReference), data)
    return true
  } catch (error) {
    return error
    // console.log(error);
  }
}

export const updatePassword = async (dob, phone, newPassword) => {
  // first check the dob is correct or not. means get the data by the phone number and check the dob is correct or not
  try {
    const userQuery = query(
      collection(db, 'user'),
      where('mobileNumber', '==', phone)
    )
    const querySnapshot = await getDocs(userQuery)

    if (querySnapshot.empty) {
      console.log('User not found')
      return null
    }

    const userDoc = querySnapshot.docs[0]
    const userData = userDoc.data()

    if (userData.dob !== dob) {
      console.log('Date of birth is incorrect')
      return null
    }

    const userRef = doc(db, 'user', userDoc.id)
    await updateDoc(userRef, { password: newPassword })

    return true
  } catch (error) {
    return error
  }
}

export const updateUser = async (referenceId, newUser) => {
  try {
    const userQuery = query(
      collection(db, 'user'),
      where('myReference', '==', referenceId)
    )
    const querySnapshot = await getDocs(userQuery)

    if (querySnapshot.empty) {
      console.log('User not found')
      return null
    }

    const userDoc = querySnapshot.docs[0]
    const userData = userDoc.data()

    // Ensure userData.children is an array
    const currentChildren = Array.isArray(userData.children)
      ? userData.children
      : []
    const newChildren = [...currentChildren, newUser]

    const userRef = doc(db, 'user', userDoc.id)
    await updateDoc(userRef, { children: newChildren })

    // Fetch updated user data directly from Firestore
    // await getDoc(userRef).data()

    return true
  } catch (error) {
    console.error('Error updating user:', error)
    return error
  }
}

export const getAllUser = async setUsers => {
  const querySnapshot = await getDocs(collection(db, 'user'))
  setUsers([])
  querySnapshot.forEach(doc => {
    const data = doc.data()
    setUsers(oldArray => [...oldArray, data])
  })
}

export const getAllUser2 = async () => {
  const querySnapshot = await getDocs(collection(db, 'user'))
  const userData = []
  querySnapshot.forEach(doc => {
    const data = doc.data()
    userData.push(data)
  })
  return userData
}

export const getUserByReference = async referenceId => {
  const userQuery = query(
    collection(db, 'user'),
    where('myReference', '==', referenceId)
  )
  const querySnapshot = await getDocs(userQuery)

  if (querySnapshot.empty) {
    console.log('User not found')
    return null
  }

  const userDoc = querySnapshot.docs[0]
  const userData = userDoc.data()
  return userData
}

export const giveMoneyWhileRegistration = async (referenceId, amount) => {
  const userQuery = query(
    collection(db, 'user'),
    where('myReference', '==', referenceId)
  )
  const adminQuery = query(collection(db, 'user'), where('role', '==', 'admin'))

  const querySnapshot = await getDocs(userQuery)
  const adminSnapshot = await getDocs(adminQuery)

  if (querySnapshot.empty) {
    console.log('User not found')
    return null
  }

  const userDoc = querySnapshot.docs[0]
  const adminDoc = adminSnapshot.docs[0]

  const userData = userDoc.data()
  const adminData = adminDoc.data()

  const userRef = doc(db, 'user', userDoc.id)
  const adminRef = doc(db, 'user', adminDoc.id)

  if (userData.myReference === adminData.myReference) {
    console.log('Admin cannot give money to himself')
    return null
  }

  await updateDoc(userRef, {
    balance: Number(userData?.balance) + Number(amount),
  })
  await updateDoc(adminRef, {
    balance: Number(adminData?.balance) - Number(amount),
  })

  // const updatedUser = (await getDoc(userRef)).data()
  // const updatedAdmin = (await getDoc(adminRef)).data()

  return true
}

export const moneyAddRemove = async (referenceId, amount, inc) => {
  const userQuery = query(
    collection(db, 'user'),
    where('myReference', '==', referenceId)
  )

  const querySnapshot = await getDocs(userQuery)

  if (querySnapshot.empty) {
    console.log('User not found')
    return null
  }

  const userDoc = querySnapshot.docs[0]
  const userData = userDoc.data()

  const userRef = doc(db, 'user', userDoc.id)

  if (inc) {
    await updateDoc(userRef, {
      balance: Number(userData?.balance) + Number(amount),
    })
  } else {
    const user = await updateDoc(userRef, {
      balance: Number(userData?.balance) - Number(amount),
    })
  }

  return true
}

export const sendMoney = async (ownReferenceId, remoteReferenceId, amount) => {
  const userQuery = query(
    collection(db, 'user'),
    where('myReference', '==', ownReferenceId)
  )
  const remoteUserQuery = query(
    collection(db, 'user'),
    where('myReference', '==', remoteReferenceId)
  )
  const adminUserQuery = query(
    collection(db, 'user'),
    where('myReference', '==', 'DR-261211')
  )

  const querySnapshot = await getDocs(userQuery)
  const remoteQuerySnapshot = await getDocs(remoteUserQuery)
  const adminQuerySnapshot = await getDocs(adminUserQuery)

  if (querySnapshot.empty) {
    console.log('User not found')
    return null
  }

  if (remoteQuerySnapshot.empty) {
    console.log('Remote user not found')
    return null
  }

  const userDoc = querySnapshot.docs[0]
  const remoteUserDoc = remoteQuerySnapshot.docs[0]
  const adminDoc = adminQuerySnapshot.docs[0]

  const userData = userDoc.data()
  const remoteUserData = remoteUserDoc.data()
  const adminData = adminDoc.data()

  const userRef = doc(db, 'user', userDoc.id)
  const remoteUserRef = doc(db, 'user', remoteUserDoc.id)
  const adminRef = doc(db, 'user', adminDoc.id)

  if (userData.myReference === remoteUserData.myReference) {
    console.log('User cannot send money to himself')
    return null
  }

  // Check if 5% of the amount is less than the user's balance
  const serviceCharge = (7 / 100) * amount

  if (userData.balance < amount + serviceCharge) {
    console.log('User does not have enough balance')
    return false
  }

  await updateDoc(userRef, {
    balance: Number(userData?.balance) - Number(amount),
  })
  await updateDoc(remoteUserRef, {
    balance: Number(remoteUserData?.balance) + Number(amount),
  })
  await updateDoc(adminRef, {
    balance: Number(adminData?.balance) + Number(serviceCharge),
  })

  // const updatedUser = (await getDoc(userRef)).data()
  // const updatedRemoteUser = (await getDoc(remoteUserRef)).data()

  return true
}

export const withdrawMoney = async (ownReferenceId, amount) => {
  const userQuery = query(
    collection(db, 'user'),
    where('myReference', '==', ownReferenceId)
  )
  const adminQuery = query(
    collection(db, 'user'),
    where('myReference', '==', 'DR-261211')
  )

  const querySnapshot = await getDocs(userQuery)
  const adminSnapshot = await getDocs(adminQuery)

  if (querySnapshot.empty) {
    console.log('User not found')
    return null
  }

  const userDoc = querySnapshot.docs[0]
  const adminDoc = adminSnapshot.docs[0]

  const userData = userDoc.data()
  const adminData = adminDoc.data()

  const serviceCharge = (5 / 100) * amount

  const userRef = doc(db, 'user', userDoc.id)
  const adminRef = doc(db, 'user', adminDoc.id)

  if (userData.balance < amount + serviceCharge) {
    console.log('User does not have enough balance')
    return false
  }

  await updateDoc(userRef, {
    balance: Number(userData?.balance) - Number(amount + serviceCharge),
  })

  await updateDoc(adminRef, {
    balance: Number(adminData?.balance) + Number(serviceCharge),
  })

  return true
}

export const login = async inputData => {
  const querySnapshot = await getDocs(collection(db, 'user'))
  let user = null
  querySnapshot.forEach(doc => {
    const data = doc.data()
    if (
      inputData.mobileNumber === data.mobileNumber &&
      inputData.password === data.password
    ) {
      user = data
    }
  })
  return user
}
