<template>
  <q-page class="q-pa-sm bg-white">
    <!-- <q-resize-observer @resize="onResize"/> -->
    <div class="row" v-if="!$q.screen.lt.md">
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card class="no-shadow" bordered style="min-height: 88vh;">
          <q-tab-panels v-model="tab" animated class="bg-white">
            <q-tab-panel name="all" class="q-pa-none full-height" style="max-height: 77vh;">
              <q-list class="" style="min-height: 75vh;">
                <q-item-label class="text-center q-pa-sm">
                  <q-input dense rounded outlined v-model="search">
                    <template v-slot:append>
                      <q-icon name="search"/>
                    </template>
                  </q-input>
                </q-item-label>
                <q-item-label header class="text-center">{{ userList.length }} {{ t('uUsers') }}</q-item-label>
                <span v-for="(user, index) in userList" :key="index" @click="selectUser(user)">
                  <user-item
                    :avatar="user.photo" :name="user.name" :phone="user.phone" :status="userStatus(user)"></user-item>
                </span>
              </q-list>
            </q-tab-panel>

            <q-tab-panel name="disabled" class="q-pa-none">
              <q-list class="">

                <q-item-label class="text-center q-pa-sm">
                  <q-input dense rounded outlined v-model="search">
                    <template v-slot:append>
                      <q-icon name="search"/>
                    </template>
                  </q-input>
                </q-item-label>
                <q-item-label header class="text-center">{{ disabledList.length }} {{ t('disabled') }}</q-item-label>

                <span v-for="(user, index) in disabledList" :key="index" @click="selectUser(user)">
                  <user-item
                    :avatar="user.photo" :name="user.name" :phone="user.phone"></user-item>
                </span>

              </q-list>
            </q-tab-panel>

          </q-tab-panels>

          <q-tabs
            v-model="tab"
            dense
            class="bg-grey-3"
            align="justify"
          >
            <q-tab name="all" icon="person" class="text-capitalize" :label="t('all')"></q-tab>
            <q-tab name="disabled" icon="block" class="text-capitalize" :label="t('disabled')"></q-tab>
          </q-tabs>
        </q-card>
      </div>
      <div class="col-lg-8 q-pl-xs col-md-8 col-sm-12 col-xs-12">
        <q-card class="no-shadow" bordered style="min-height: 88vh;">
          <q-toolbar class="text-black ">
            <q-btn round flat class="q-pa-sm">
              <q-avatar size="80px">
                <img :src="selectedUser.photo">
              </q-avatar>
            </q-btn>

            <q-item class="q-subtitle-1 q-pl-md">
              <q-item-section>
                <q-item-label lines="1">{{ selectedUser.first_name || t('users') }} {{ selectedUser.last_name }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-space/>
            <div v-if="selectedUser.username">
              <q-btn round flat icon="lock"
                :color="selectedUser.is_active ? 'red' : 'green'"
                @click="confirmUserStatus(selectedUser)">
                <q-tooltip>{{ selectedUser.is_active ? t('disable') : t('enable') }} {{ t('thisUser')}}</q-tooltip>
              </q-btn>
              <q-btn round flat icon="key" color="warning" @click="showChangePassword(selectedUser.id)">
                <q-tooltip>{{ t('changeUserPassword') }}</q-tooltip>
              </q-btn>
              <q-btn round flat icon="visibility" color="brown" @click="showChangePermissions(selectedUser.id)">
                <q-tooltip>{{ t('changeUserPermissions') }}</q-tooltip>
              </q-btn>
              <q-btn round flat icon="edit" color="primary" @click="showAdd(selectedUser.id)">
                <q-tooltip>{{ t('editThisUser') }}</q-tooltip>
              </q-btn>
            </div>

          </q-toolbar>
          <q-separator></q-separator>

          <div v-for="(detail, detailIndex) in detailList" :key="detailIndex">

            <user-detail-item :icon="detail.icon" :textColor="detail.textColor"
              :value="selectedUser[detail['field']]" :label="t(detail.label)"></user-detail-item>

            <q-separator inset="item" v-if="detailIndex!=detailList.length-1"></q-separator>
          </div>

        </q-card>
      </div>
    </div>

    <div v-else>
      <div v-if="(selectedUser.id || 0) === 0">
        <q-tab-panels v-model="tab" animated class="bg-white">
          <q-tab-panel name="all" class="q-pa-none full-height" style="max-height: 77vh;">
            <q-list class="">
              <q-item-label class="text-center q-pa-sm">
                <q-input dense rounded outlined v-model="search">
                  <template v-slot:append>
                    <q-icon name="search"/>
                  </template>
                </q-input>
              </q-item-label>
              <q-item-label header class="text-center">{{ userList.length }} {{ t('uUsers') }}</q-item-label>
              <span v-for="(user, index) in userList" :key="index" @click="selectUser(user)">
                <user-item
                  :avatar="user.photo" :name="user.name" :phone="user.phone" :status="userStatus(user)"></user-item>
              </span>

            </q-list>
          </q-tab-panel>

          <q-tab-panel name="disabled" class="q-pa-none">
            <q-list class="">

              <q-item-label class="text-center q-pa-sm">
                <q-input dense rounded outlined v-model="search">
                  <template v-slot:append>
                    <q-icon name="search"/>
                  </template>
                </q-input>
              </q-item-label>
              <q-item-label header class="text-center">{{ disabledList.length }} Disabled</q-item-label>

              <span v-for="(user, index) in disabledList" :key="index" @click="selectUser(user)">
                <user-item
                  :avatar="user.photo" :name="user.name" :phone="user.phone"></user-item>
              </span>

            </q-list>
          </q-tab-panel>

        </q-tab-panels>
        <q-tabs
          v-model="tab"
          dense
          class="bg-grey-3"
          align="justify"
        >
          <q-tab name="all" icon="person" class="text-capitalize" :label="t('all')"></q-tab>
          <q-tab name="disabled" icon="block" class="text-capitalize" :label="t('disabled')"></q-tab>
        </q-tabs>
      </div>
      <transition v-else
        appear
        enter-active-class="animated bounceInRight"
      >
        <q-card class="no-border no-border">
          <q-toolbar class="text-black ">
            <q-btn round flat class="q-pa-sm">
              <q-avatar size="80px">
                <img :src="selectedUser.photo">
              </q-avatar>
            </q-btn>

            <q-item class="q-subtitle-1 q-pl-md">
              <q-item-section>
                <q-item-label lines="1">{{ selectedUser.first_name }} {{ selectedUser.last_name }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-space/>

            <q-btn round flat icon="lock"
              :color="selectedUser.is_active ? 'red' : 'green'"
              @click="confirmUserStatus(selectedUser)">
              <q-tooltip>{{ selectedUser.is_active ? t('disable') : t('enable') }} {{ t('thisUser')}}</q-tooltip>
            </q-btn>
            <q-btn round flat icon="key" color="warning" @click="showChangePassword(selectedUser.id)">
              <q-tooltip>{{ t('changeUserPassword') }}</q-tooltip>
            </q-btn>
            <q-btn round flat icon="visibility" color="brown" @click="showChangePermissions(selectedUser.id)">
                <q-tooltip>{{ t('changeUserPermissions') }}</q-tooltip>
              </q-btn>
            <q-btn round flat icon="edit" color="primary" @click="showAdd(selectedUser.id)">
              <q-tooltip>{{ t('editThisUser') }}</q-tooltip>
            </q-btn>
            <q-btn round flat icon="keyboard_backspace" @click="selectUser({})"/>

          </q-toolbar>
          <q-separator></q-separator>

          <div v-for="(detail, detailIndex) in detailList" :key="detailIndex">
            <user-detail-item :icon="detail.icon" :textColor="detail.textColor"
              :value="selectedUser[detail['field']]" :label="t(detail.label)"></user-detail-item>

            <q-separator inset="item" v-if="detailIndex!=detailList.length-1"></q-separator>
          </div>
        </q-card>
      </transition>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="green" @click="showAdd(0)" />
    </q-page-sticky>
    <q-dialog v-model="showUserForm">
      <user-dialog :userId="userId" @closeMeEvent="handleCloseDialog"></user-dialog>
    </q-dialog>
    <q-dialog v-model="showPasswordForm">
      <user-password :userId="userId" @closeMeEvent="handleCloseDialog"></user-password>
    </q-dialog>
    <q-dialog v-model="showUserPermissions">
      <user-permissions :userId="userId" @closeMeEvent="handleCloseDialog"></user-permissions>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref, defineAsyncComponent, onMounted, onUnmounted, computed } from 'vue';
import { useUserStore } from "src/stores/user-store";
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();


const UserDetailItem = defineAsyncComponent(() => import('components/UserDetailItem.vue'));
const UserItem = defineAsyncComponent(() => import('components/UserItem.vue'));
const UserDialog = defineAsyncComponent(() => import('components/UserDialog.vue'));
const UserPassword = defineAsyncComponent(() => import('components/ChangeUserPassword.vue'));
const UserPermissions = defineAsyncComponent(() => import('components/ChangeUserPermissions.vue'));

const userStore = useUserStore();

const detailList = [
  {
    icon: 'phone',
    label: 'phone',
    field: 'phone',
    textColor: 'blue'
  },
  {
    icon: 'person',
    label: 'username',
    field: 'username',
    textColor: 'orange'
  },
  {
    icon: 'mail',
    label: 'emailAddress',
    field: 'email',
    textColor: 'grey-8'
  },
  {
    icon: 'location_on',
    label: 'address',
    field: 'address',
    textColor: 'grey-8'
  },
  {
    icon: 'info',
    label: 'about',
    field: 'about',
    textColor: 'grey-8'
  },
  {
    icon: 'check',
    label: 'active',
    field: 'status',
    textColor: 'grey-8'
  },
];

const $q = useQuasar();
const tab = ref('all');
const search = ref('');
const loading = ref(false);
const showUserForm = ref(false);
const showPasswordForm = ref(false);
const userDetails = ref({});
const userId = ref(0);


const loadUsers = async() => {
  loading.value = true;
  await userStore.getUsers();
  loading.value = false;
};

const selectUser = async(user) => {
  loading.value = true;
  await userStore.getUserDetails(user?.id || 0);
  loading.value = false;
};

let intervalId = null;
const onlineUsers = computed({
  get: () => userStore.getOnlineUsers,
});
onMounted(() => {
  loadUsers();
  userStore.retrieveOnlineUsers();
  intervalId = setInterval(() => {
    userStore.retrieveOnlineUsers();
  }, 10000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
const userList = computed({
  get: () => search.value ? userStore.getUserList.filter((u) => u.name.toLowerCase().includes(search.value)) : userStore.getUserList,
});

const disabledList = computed({
  get: () => userList.value.filter((u) => !u.is_active),
});

const selectedUser = computed({
  get: () => userStore.getSelectedUser,
});

  const showAdd = (userIdToEdit) => {
    userId.value = userIdToEdit;
    showUserForm.value = true;
  };

  const showChangePassword = (userIdToEdit) => {
    userId.value = userIdToEdit;
    showPasswordForm.value = true;
  }

  const handleCloseDialog = async(isSaved) => {
    showUserForm.value = false;
    showPasswordForm.value = false;
    showUserPermissions.value = false;
    if (isSaved) {
      await loadUsers();
      await userStore.retrieveOnlineUsers();
    };
  };

  const showUserPermissions = ref(false);
  const showChangePermissions = (userIdToEdit) => {
    userId.value = userIdToEdit;
    showUserPermissions.value = true;
  };

  const confirmUserStatus = (user) => {
    const actionName = user.is_active ? 'disableUserConfirm' : 'enableUserConfirm';
    $q.dialog({
      title: t('onfirm'),
      message: t(actionName),
      cancel: true,
      persistent: false,
    }).onOk(async() => {
      const info = {
        id: user.id,
        is_active: !user.is_active,
      };
      await userStore.patchUser(info);
      await loadUsers();
      await userStore.getUserDetails(user.id);
      $q.notify({
        type: 'positive',
        position: 'top-right',
        message: t('statusChanged'),
        progress: true,
        actions: [
          { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
        ],
      });
    }).onCancel(() => {
      // console.log('>>>> Cancel')
    }).onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
  };

  const userStatus = (user) => {
    const status = onlineUsers.value.filter((i) => i.user === user.id);
    if (status.length === 1) return status[0];
    return {
      online: false,
      last_seen: null,
    };
  };
</script>
<style scoped>

  .card-bg {
    background-color: #2a313b;
  }
  .center {
    margin-left: auto;
    margin-right: auto;
  }

  [v-cloak] {
  display: none !important;
}
</style>
